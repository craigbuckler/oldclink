/*
	Utility library

	// requires: config.js polyfills.js font.js pwa.js
*/
/* global oc */

oc.lib = (function() {

  'use strict';


  // each
  function each(obj, fn) {
    if (obj.length || obj.length === 0) for (var i = 0, ol = obj.length, v = obj[0]; i < ol && fn(v, i) !== false; v = obj[++i]);
    else for (var p in obj) if (fn(obj[p], p) === false) break;
  }


  // getElementsById
  function id(idName) {
    return document.getElementById(idName);
  }


  // getElementsByTagName
  function tag(tagName, doc) {
    doc = doc || document;
    return doc.getElementsByTagName(tagName);
  }


  // getElementsByClassName
  function className(cn, doc) {
    doc = doc || document;
    return doc.getElementsByClassName(cn);
  }


  // querySelector
  function query(sel, doc) {
    doc = doc || document;
    return doc.querySelector(sel);
  }


  // querySelectorAll
  function queryAll(sel, doc) {
    doc = doc || document;
    return doc.querySelectorAll(sel);
  }


  // closest
  function closest(type, node) {
    type = type.toUpperCase();
    var pNode = null;
    while(!pNode && node.parentNode) {
      if (node.nodeName == type) pNode = node;
      node = node.parentNode;
    }
    return pNode;
  }


  // remove all child nodes
  function empty(node) {
    while (node.lastChild) node.removeChild(node.lastChild);
  }


  // parses the URL querystring
  function queryStringParse(str) {

    var
      val = {},
      qs = (str || window.location.search.slice(1)).split('&'),
      q, v;

    // parse individual values
    for (q = 0; q < qs.length; q++) {
      v = qs[q].split('=');
      if (v.length == 2) {
        val[v[0]] = decodeURI(v[1]);
      }
    }

    return val;
  }


  // event debouncing (delay passes without event reoccurring)
  function eventDebounce(element, event, callback, delay) {
    delay = delay || 300;
    var debounce;
    element.addEventListener(event, function(e) {
      if (debounce) clearInterval(debounce);
      debounce = setTimeout(function(){ callback(e); }, delay);
    }, false);
  }


  // event throttling (will call every delay period regardless of event occurances)
  function eventThrottle(element, event, callback, delay) {
    delay = delay || 300;
    var throttle, latest;
    element.addEventListener(event, function(e) {
      if (throttle) {
        // latest event
        latest = e;
      }
      else {
        // prevent new events and callback
        throttle = setTimeout(function(){
          throttle = null;
          if (latest) callback(latest);
        }, delay);
        callback(e);
      }
    }, false);
  }


  // custom events
  if (CustomEvent && window.addEventListener && window.requestAnimationFrame && document.body.classList) {

    // throttled scroll/resize
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', scroller, false);

  }

  var scTimer, scPos = 0, scClass;
  function scroller() {

    scTimer = scTimer || setTimeout(function() {

      // page scroll direction
      var
        wY = window.pageYOffset,
        dir = Math.sign(wY - scPos);
      scPos = wY;

      // dispatch event
      scTimer = null;
      requestAnimationFrame(function() {

        if (scClass !== dir) {
          document.body.classList.remove('scroll' + scClass);
          scClass = dir;
          document.body.classList.add('scroll' + scClass);
        }

        window.dispatchEvent(new CustomEvent('scrollresize', { detail: { dir: dir }}));
      });
    }, 300);

  }


  // create object from form data (set forQS true to create a querystring)
  function getFormData(form, forQS) {
    var arg = (forQS ? [] : {}), e, fe, val;
    for (e = 0; e < form.elements.length; e++) {
      fe = form.elements[e];
      if (fe.name && fe.value && !fe.disabled && fe.nodeName != 'BUTTON') {
        val = (fe.type == 'checkbox' || fe.type == 'radio' ? (fe.checked ? fe.value || 'on' : '') : fe.value);
        if (val) {
          if (forQS) arg.push(fe.name + '=' + encodeURIComponent(val));
          else arg[fe.name] = val;
        }
      }
    }
    return (forQS ? arg.join('&') : arg);
  }


  // Ajax handler:
  // obj				- form node or URL string (required)
  // callback		- return function passed err, url, data (optional)
  // appendData	- external function to append data (optional)
  // progress		- progress function (optional)
  // timeout		- timeout in ms (optional, 10 second default)
  function ajax(obj, callback, appendData, progress, timeout) {

    // settings
    var
      req, ptime = +new Date(), complete = false, timeoutCheck,
      url = obj, retUrl = url,
      method = 'GET',
      data = null;

    callback = callback || function(){};
    timeout = timeout || 10000;

    if (typeof obj == 'string') {

      // string passed
      url += (url.lastIndexOf('?') < 0 ? '?' : '&') + 'ajax=1';

    }
    else {

      // form node passed
      url = retUrl = obj.action;
      method = (obj.method || 'GET').toUpperCase();

      // get argument data
      if (method == 'GET') {
        retUrl += '?' + getFormData(obj, true);
        url = retUrl + '&ajax=1';
      }
      else {
        if (obj.nodeType) data = new FormData(obj);
        else data = new FormData();
        if (appendData) data = appendData(data);
        data.append('ajax', 1);
      }

    }

    // initialise call
    req = new XMLHttpRequest();
    req.open(method, url);
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    // progress handler
    req.upload.onprogress = function(p) {
      ptime = +new Date();
      if (progress) progress(p);
    };

    // state change
    req.onreadystatechange = function() {

      if (req.readyState != 4) return;
      complete = true;
      var err = (req.status != 200), data = null;
      if (!err) {
        try {
          data = JSON.parse(req.response);
        }
        catch(e) {
          data = req.response || null;
        }
      }
      callback(err, retUrl, data);
    };

    // start
    req.send(data);

    // timeout
    timeoutCheck = function() {

      // request already ended?
      if (complete) return;

      // recheck later
      if ((+new Date() - ptime) < timeout) setTimeout(timeoutCheck, 10000);
      else {
        // abort request
        complete = true;
        req.abort();
        callback('TIMEOUT', retUrl, null);
      }

    };
    timeoutCheck();

  }


  // public methods
  return {
    each: each,
    id: id,
    tag: tag,
    className: className,
    query: query,
    queryAll: queryAll,
    closest: closest,
    empty: empty,
    queryStringParse: queryStringParse,
    eventDebounce: eventDebounce,
    eventThrottle: eventThrottle,
    getFormData: getFormData,
    ajax: ajax
  };

})();
