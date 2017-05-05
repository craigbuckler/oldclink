/*
	Google map

	// requires: lib.js
*/
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

// load maps API
window.addEventListener('load', function() {

  map = oc.lib.id(cfg.id);
  if (map) {

    // load map API
    var scr = document.createElement('script');
    scr.src = 'https://maps.googleapis.com/maps/api/js?key=' + cfg.api + '&callback=oc.mapStart';
    scr.async = 1;
    document.head.appendChild(scr);

  }

}, false);


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
  var marker = new google.maps.Marker({
    position: cfg.center,
    map: mapControl
  });

};


})();
