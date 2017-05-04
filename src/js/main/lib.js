/*
	Utility library

	// requires: config.js polyfills.js font.js pwa.js
*/

oc.lib = (function() {

	'use strict';


	// each
	function each(obj, fn) {
		if (obj.length || obj.length === 0) for (var i = 0, ol = obj.length, v = obj[0]; i < ol && fn(v, i) !== false; v = obj[++i]);
		else for (var p in obj) if (fn(obj[p], p) === false) break;
	}


	// getElementsById
	function id(idName) {
		return document.getElementById(idName);
	}


	// getElementsByTagName
	function tag(tagName, doc) {
		doc = doc || document;
		return doc.getElementsByTagName(tagName);
	}


	// getElementsByClassName
	function className(cn, doc) {
		doc = doc || document;
		return doc.getElementsByClassName(cn);
	}


	// querySelector
	function query(sel, doc) {
		doc = doc || document;
		return doc.querySelector(sel);
	}


	// querySelectorAll
	function queryAll(sel, doc) {
		doc = doc || document;
		return doc.querySelectorAll(sel);
	}


	// closest
	function closest(type, node) {
		type = type.toUpperCase();
		var pNode = null;
		while(!pNode && node.parentNode) {
			if (node.nodeName == type) pNode = node;
			node = node.parentNode;
		}
		return pNode;
	}


	// remove all child nodes
	function empty(node) {
		while (node.lastChild) node.removeChild(node.lastChild);
	}


	// parses the URL querystring
	function queryStringParse(str) {

		var
			val = {},
			qs = (str || window.location.search.slice(1)).split('&'),
			q, v;

		// parse individual values
		for (q = 0; q < qs.length; q++) {
			v = qs[q].split('=');
			if (v.length == 2) {
				val[v[0]] = decodeURI(v[1]);
			}
		}

		return val;
	}


	// event debouncing (delay passes without event reoccurring)
	function eventDebounce(element, event, callback, delay) {
		delay = delay || 300;
		var debounce;
		element.addEventListener(event, function(e) {
			if (debounce) clearInterval(debounce);
			debounce = setTimeout(function(){ callback(e); }, delay);
		}, false);
	}


	// event throttling (will call every delay period regardless of event occurances)
	function eventThrottle(element, event, callback, delay) {
		delay = delay || 300;
		var throttle, latest;
		element.addEventListener(event, function(e) {
			if (throttle) {
				// latest event
				latest = e;
			}
			else {
				// prevent new events and callback
				throttle = setTimeout(function(){
					throttle = null;
					if (latest) callback(latest);
				}, delay);
				callback(e);
			}
		}, false);
	}


	// custom events
	if (CustomEvent && window.addEventListener && window.requestAnimationFrame && document.body.classList) {

		// throttled scroll/resize
		window.addEventListener('scroll', scroller, false);
  	window.addEventListener('resize', scroller, false);

	}

	var scTimer, scPos = 0, scClass;
	function scroller(e) {

		scTimer = scTimer || setTimeout(function() {

			// page scroll direction
			var
				wY = window.pageYOffset,
				dir = Math.sign(wY - scPos);
			scPos = wY;

			// dispatch event
			scTimer = null;
			requestAnimationFrame(function() {

				if (scClass !== dir) {
					document.body.classList.remove('scroll' + scClass);
					scClass = dir;
					document.body.classList.add('scroll' + scClass);
				}

				window.dispatchEvent(new CustomEvent('scrollresize', { detail: { dir: dir }}));
			});
		}, 300);

	}


	// public methods
	return {
		each: each,
		id: id,
		tag: tag,
		className: className,
		query: query,
		queryAll: queryAll,
		closest: closest,
		empty: empty,
		queryStringParse: queryStringParse,
		eventDebounce: eventDebounce,
		eventThrottle: eventThrottle,
	};

})();
