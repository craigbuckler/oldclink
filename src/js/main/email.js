/*
	email parser

	// requires: lib.js
*/

(function() {

'use strict';

oc.lib.each(oc.lib.className(oc.emailClass), function(e) {
	if (e.nodeName === 'A') {
		var es = e.textContent.replace(/\sdot\s/ig, '.').replace(/\{at\}/ig,'@').replace(/\s/g,'');
		e.href = 'ma' + 'ilt' + 'o:' + es;
		e.textContent = es;
	}
});

})();