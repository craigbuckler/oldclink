/*
	font loader

	// requires: config.js
*/
/* global oc */

(function() {

  'use strict';

  if (!oc.font || !document.body || !document.head) return;

  // load font
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = oc.font;
  css.onload = function() { document.body.className += ' wf-active'; };
  document.head.appendChild(css);

})();
