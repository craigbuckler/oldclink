/*
metalsmith-addmeta
adds further meta information for templates:

files[] properties:

	title					- default title
	menu					- default menu name
	root					- reference to root path (no domain)
	url						- relative URL
	hero					- hero image URL
	image1				- first image URL
	thumb					- thumbnail image URL (thumb || image1 || hero)
	priority			- default priority
	date					- default date
	dateFormatted	- formmatted default date
	private				- page is private and does not appear in navigation
	navrel				- object containing links to:
		.parent			- .title and .url
		.back				- .title and .url
		.next				- .title and .url
		.child			- array of child objects (.title, .description, .url, .date, .dateF)

	meta() properties:

		nav					- array of menu items
									each item has a child[] array which references child pages

*/
module.exports = (opt) => {

	'use strict';

	// plugin options
	opt = opt || {};
	opt.menuLowerCase = !!opt.menuLowerCase;

	// path separator and months
	const
		reSep = /\\|\//g,
		reImg = /<img.+src="([^"]+)"/i,
		month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	return (files, metalsmith, done) => {

		let
			meta = metalsmith.metadata(),
			tags = [], nav = [];

		for (let f in files) {

			let
				file = files[f],
				content = file.contents.toString();

			// calculate root
			file.root = file.root || meta.rootpath || '../'.repeat(f.split(reSep).length);

			// URL
			file.url = f.replace('index.html', '');

			// default priority
			file.priority = file.priority || 0.2;

			// private
			file.private = !!file.private;

			// tag list
			file.tag = (file.tag || '').split(',').map(s => s.replace(/\s+/g,' ').trim()).filter(s => !!s);
			file.tagL = file.tag.map(s => s.replace(/\s/g,'-').toLowerCase());
			tags = tags.concat(file.tagL);

			// date from date, publish, file creation or now
			file.date =
				(Date.parse(file.date) && new Date(file.date)) ||
				(Date.parse(file.publish) && new Date(file.publish)) ||
				(file.stats && file.stats.mtime) || new Date();

			// formatted date
			file.dateFormatted =
				file.date.getUTCDate() + ' ' +
				month[file.date.getUTCMonth()] + ', ' +
				file.date.getUTCFullYear();

			// hero image and quotes
			file.hero = file.hero || null;
			file.heroquote = file.heroquote || null;
			file.herocite = file.herocite || null;

			// first image
			let img = content.match(reImg);
			file.image1 = (img && img.length === 2 ? img[1] : null);

			// thumbnail
			file.thumb = file.thumb || file.image1 || file.hero || null;

			// navigation tree
			let
				navlist = f.split(reSep).slice(0,-1),
				tNav = nav;

			file.navlist = [
				navlist[0] || 'index',
				navlist[1] || null
			];

			if (!navlist.length) navlist.push('index');

			// menu name
			file.menu = file.menu || navlist[navlist.length - 1];
			if (opt.menuLowerCase) file.menu = file.menu.toLowerCase();

			// default title
			file.title = file.title || file.menu;

			for (let n = 0; n < navlist.length; n++) {

				let
					nItem = navlist[n],
					data = {},
					m = 0, found = -1;

				if (n + 1 === navlist.length) {
					data = {
						item				: nItem,
						level				: n,
						index				: f,
						url					: file.url,
						title				: file.title,
						description	: file.description,
						menu				: file.menu,
						date				: file.date,
						dateF				: file.dateFormatted,
						thumb				: file.thumb,
						priority		: file.priority,
						tag					: file.tag,
						private			: !!file.private,
						nomenu			: !!file.nomenu,
						orderby			: file.orderby || 'priority',
						reverse			: !!file.reverse
					};
				}

				data.child = data.child || [];

				while (found < 0 && m < tNav.length) {
					if (nItem === tNav[m].item) found = m;
					else m++;
				}

				if (found < 0) {
					tNav.push(data);
					found = tNav.length - 1;
				}

				tNav = tNav[found].child;

			}

		}

		// recurse and reorder navigation
		let rootNav = {
			nomenu		: false,
			orderby		: 'priority',
			reverse		: false,
			level			: -1,
			child			: nav
		};

		orderNav(rootNav);
		addNav(rootNav);
		meta.nav = rootNav.child;

		// master tag list (remove duplicates)
		meta.tag = Array.from(new Set(tags));

		// complete
		done();


		// recurse the navigation and sort
		function orderNav(nav) {

			// sort menu
			nav.child.sort((a, b) => {
				return (a[nav.orderby] > b[nav.orderby] ? 1 : -1) * (nav.orderby === 'priority' ? -1 : 1) * (nav.reverse ? -1 : 1);
			});

			for (let c = 0; c < nav.child.length; c++) orderNav(nav.child[c]);

		}


		// add nav.next, nav.back, nav.parent and nav.child to pages
		function addNav(nav) {

			for (let c = 0; c < nav.child.length; c++) {

				files[nav.child[c].index].navrel = {

					parent	: nav.url && (!nav.private || nav.child[c].private) ?
											{ title: nav.title, url: nav.url } :
											null,

					back		: c === 0 || (nav.child[c-1].private && !nav.child[c].private) ?
											null :
											{ title: nav.child[c-1].title, url: nav.child[c-1].url },

					next		: c+1 === nav.child.length || (nav.child[c+1].private && !nav.child[c].private) ?
											null :
											{ title: nav.child[c+1].title, url: nav.child[c+1].url },

					child		: nav.child[c].child
											.filter(i => !i.private || i.private === nav.child[c].private)
											.map(i => { return {
												title				: i.title,
												description	: i.description || null,
												url					: i.url,
												thumb				: i.thumb,
												date				: i.date,
												dateF				: i.dateF,
												tag					: i.tag
											}; })
				};

				addNav(nav.child[c]);

			}

		}

	};

};