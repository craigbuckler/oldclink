/*
  Google Analytics

  // requires: lib.js
*/
/* global oc gtag dataLayer */
(function() {

  'use strict';

  if (!oc.analytics || oc.devBuild || location.host.indexOf('.co') < 0 || !document.head) return;

  // load analytics API
  setTimeout(function() {

    var gScript = document.createElement('script');
    gScript.onload = initAnalytics;
    gScript.async = 1;
    document.head.appendChild(gScript);
    gScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + oc.analytics;

  }, 200);


  // initialise Analytics
  function initAnalytics() {

    // record page view
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', oc.analytics);

    // telephone/mail custom event
    if (window.addEventListener) document.body.addEventListener('click', function(e) {

      if (typeof gtag === 'undefined' || !e || !e.target || !e.target.href) return;

      var type = String(e.target.href).trim().toLowerCase().match(/^[^:]+:/);
      if (!type || !type.length) return;
      type = type[0];

      // record event
      if (type === 'tel:' || type === 'mailto:') {
        gtag('event', 'contact', { 'method': type.slice(0, -1) });
      }

      // add email subject and body
      if (type === 'mailto:') {
        var q = location.search.match(/book=([^&]+)/i);
        q = (q && q.length && q.length == 2 ? q[1] + '%20' : '');
        e.target.href += '?subject=' + q + 'booking&body=telephone:%20%0D%0Aoccupants:%20%0D%0Afrom%20date:%20%0D%0Ato%20date:%20%0D%0A';
      }

    }, false);

  }

})();
