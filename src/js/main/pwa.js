/*
  Enable PWA service worker

  // requires: config.js
*/

(function() {

'use strict';

// enable service worker
if (oc.pwa && 'serviceWorker' in navigator) {

  // register service worker
  navigator.serviceWorker.register('/sw.js');

  // load script to populate offline page list
  if (document.getElementById('/* @echo offlineList */') && 'caches' in window) {
    var scr = document.createElement('script');
    scr.src = '/js/offlinepage.js';
    scr.async = 1;
    document.head.appendChild(scr);
  }

}

})();
