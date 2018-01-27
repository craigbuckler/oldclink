/*
	menu remove URL #target after navigation animation and page unload

	// requires: lib.js
*/
/* global oc */

(function() {

  'use strict';

  if (!window.addEventListener) return;

  window.addEventListener('unload', removeTarget, false);

  var menu = oc.lib.id(oc.menuId);
  if (menu) menu.addEventListener('animationend', function() { setTimeout(removeTarget, 100); }, false);

  function removeTarget() {
    history.replaceState('', document.title, location.pathname + location.search);
  }

})();
