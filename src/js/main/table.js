/*
	applies classes to table cells with 'yes'

	// requires: lib.js
*/

(function() {

'use strict';

if (!window.addEventListener) return;

// string to find, class to apply
var
  find = 'yes',
  cAdd = 'icon tick';

window.addEventListener('load', function() {

  oc.lib.each(oc.lib.tag('td'), function(td) {
    if (td && td.textContent && td.textContent.trim().toLowerCase() === find) td.className = cAdd;
  });

}, false);

})();
