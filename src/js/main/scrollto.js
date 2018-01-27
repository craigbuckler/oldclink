/*
	Scroll to an element

	// requires: lib.js
*/
/* global oc */

(function() {

  'use strict';

  if (!window.addEventListener || !window.requestAnimationFrame || !document.body.classList || !document.body.dataset) return;

  var cfg = {
      element: 'a',
      noscroll: 'noscroll',
      active: 'active',
      scrollTime: 500
    },
    element = [],
    activeElement = -1,
    isScrolling = false;

  // find links and add event
  var section, sType, e, l, link = oc.lib.queryAll(cfg.element);
  for (l = 0; l < link.length; l++) {
    if (link[l].hash && link[l].pathname === location.pathname && !link[l].classList.contains(cfg.noscroll)) {
      section = oc.lib.id(link[l].hash.slice(1));
      sType = section ? section.nodeName.toLowerCase() : null;
      if (sType && sType != 'input' && sType != 'output' && sType != 'textarea' && sType != 'select') {
        e = element.length;
        link[l].dataset.scrollto = e;
        element[e] = { link: link[l], section: section };
        link[l].addEventListener('click', scrollHandler, false);

        // scroll to linked location (prevents sticky header mis-alignment)
        if (link[l].hash == location.hash) scrollHandler(e);
      }
    }

  }

  // window scrolling (throttled event)
  oc.lib.eventThrottle(window, 'scroll', windowScrollHandler, 100);
  windowScrollHandler();

  // click handler
  function scrollHandler(e) {

  // find linked section
    var s = e && e.target ? e.target.dataset.scrollto : e;
    if (s === undefined) return;

    if (e.preventDefault) e.preventDefault();

    activeItem(s);
    var se = element[s].section;

    // scroll animation
    isScrolling = true;
    var start = null, startY = window.pageYOffset, scrollBy = se.offsetTop - startY;

    function scrollToElement(timestamp) {
      if (!start) start = timestamp;
      var
        progress = Math.min(timestamp - start, cfg.scrollTime),
        t = progress / cfg.scrollTime,
        ease = (t < 0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t);

      window.scrollTo(0, startY + (scrollBy * ease));
      if (progress < cfg.scrollTime) {
        requestAnimationFrame(scrollToElement);
      }
      else {
        isScrolling = false;
      }
    }
    requestAnimationFrame(scrollToElement);

  }

  // window scrolled handler - change highlighted menu
  function windowScrollHandler() {

    if (isScrolling) return;

    // act on next animation frame
    requestAnimationFrame(function() {

      var wY = window.pageYOffset, i, activate;
      for (i = 0; i < element.length; i++) {
        if (element[i].section.offsetParent && wY >= element[i].section.offsetTop) activate = i;
      }

      activeItem(activate);

    });

  }


  // activate item
  function activeItem(activate) {

    if (activate != activeElement) {
      if (activeElement >= 0) element[activeElement].link.classList.remove(cfg.active);
      activeElement = activate;
      if (activeElement >= 0) element[activeElement].link.classList.add(cfg.active);
    }

  }

})();
