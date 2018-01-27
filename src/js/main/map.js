/*
	Google map

	// requires: lib.js analytics.js
*/
/* global oc google */
(function() {

  'use strict';

  if (!window.addEventListener || !document.body.classList) return;

  var
    cfg = {
      id: 'map',
      active: 'active',
      center: { lat: 50.629000, lng: -3.322431 },
      zoom: 15,
      type: 'roadmap',
      api: 'AIzaSyC2hLWIi3-LUMcdbXcYXKpTo-phXX9snJo'
    },
    map;

  // load maps API after delay
  map = oc.lib.id(cfg.id);
  if (map) {

    setTimeout(function() {
      window.addEventListener('scrollresize', mapInView, false);
      mapInView();
    }, 2000);

  }

  // load map when in view
  function mapInView() {

    var
      wT = window.pageYOffset,
      wB = wT + window.innerHeight,
      cRect = map.getBoundingClientRect(),
      pT = wT + cRect.top,
      pB = pT + cRect.height;

    if (wT < pB && wB > pT) {

      // cancel event
      window.removeEventListener('scrollresize', mapInView, false);

      // load map API
      var scr = document.createElement('script');
      scr.src = 'https://maps.googleapis.com/maps/api/js?key=' + cfg.api + '&callback=ow.mapStart';
      scr.async = 1;
      document.head.appendChild(scr);

    }

  }

  // show map
  oc.mapStart = function() {

  // activate map element
    map.classList.add(cfg.active);

    // show map
    var mapControl = new google.maps.Map(map, {
      center: cfg.center,
      zoom: cfg.zoom,
      mapTypeId: cfg.type
    });

    // show marker
    new google.maps.Marker({
      position: cfg.center,
      map: mapControl
    });

  };


})();
