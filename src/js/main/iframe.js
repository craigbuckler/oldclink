/*
  iframe lazy loading

  // requires: lib.js
*/
/* global oc ga */
(function() {

  'use strict';

  // unsupported browser
  if (!CustomEvent || !document.getElementsByClassName || !document.body.classList) return;


  // progressive image loader
  window.addEventListener('load', function() {

    // start
    var fItem = document.getElementsByClassName('iframe load');

    // custom scroll/resize event
    window.addEventListener('scrollresize', inView, false);
    inView();


    // image in view?
    function inView() {

      var wT = window.pageYOffset, wB = wT + window.innerHeight, cRect, pT, pB, p = 0, frame, src;
      while (p < fItem.length) {

        frame = fItem[p];
        cRect = frame.getBoundingClientRect();
        pT = wT + cRect.top;
        pB = pT + cRect.height;

        // load frame
        if (wT < pB && wB > pT) {
          frame.classList.remove('load');
          src = frame && (frame.href || frame.getAttribute('data-src'));
          if (src) frame.src = src;
        }
        else p++;

      }

    }

  }, false);

})();
