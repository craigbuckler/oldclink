/*
	applies classes to table cells with 'yes'

	// requires: lib.js
*/
/* global oc */

(function() {

  'use strict';

  if (!window.addEventListener) return;

  // string to find, class to apply
  var change = [
    {
      find: 'yes',
      cAdd: 'icon tick'
    },
    {
      find: 'no',
      cAdd: 'none'
    }
  ];


  window.addEventListener('load', function() {

    oc.lib.each(oc.lib.tag('td'), function(td) {
      for (var c = change.length - 1; c >= 0; c--) {
        if (td && td.textContent && td.textContent.trim().toLowerCase() === change[c].find) td.className = change[c].cAdd;
      }
    });

  }, false);

})();
