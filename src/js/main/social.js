/*
	Social media sharing popup

	// requires: lib.js analytics.js
*/
/* global gtag */

(function() {

  'use strict';

  if (!window.addEventListener || !document.body.classList) return;

  // configuration
  var cfg = {
    className: 'social',
    width: 600,       // optimal popup width
    height: 600,      // optimal popup height
    minmargin: 10     // mimimum margin around popup
  };

  document.body.addEventListener('click', function(e) {

    if (!e.target.classList.contains(cfg.className)) return;

    // open popup
    var
      t = e.target,
      sw = screen.availWidth || 1024,
      sh = screen.availHeight || 700,
      pw = Math.min(cfg.width, (sw - cfg.minmargin * 2)),
      ph = Math.min(cfg.height, (sh - cfg.minmargin * 2)),
      px = Math.floor((sw - pw) / 2),
      py = Math.floor((sh - ph) / 2),
      popup = window.open(t.href, 'social',
        'width=' + pw +
      ',height='+ph+
      ',left=' + px +
      ',top=' + py +
      ',location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1'
      );

    if (popup) {
      popup.focus();
      e.preventDefault();
    }

    // analytics event
    if (typeof gtag !== 'undefined') {

      gtag('event', 'social', { 'network': String(e.target.className || '').replace('icon', '').replace(cfg.className, '').trim() || 'unknown' });

    }

    return !!popup;

  }, false);

})();
