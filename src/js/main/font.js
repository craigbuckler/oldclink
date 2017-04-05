/*
	font loader

	// requires: config.js
*/

(function() {

'use strict';

if (!oc.font) return;

// load font
var css = document.createElement('link');
css.rel = 'stylesheet';
css.href = oc.font;
css.onload = function() { document.body.className += ' wf-active'; };
document.head.appendChild(css);

})();
