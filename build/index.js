"use strict";

function c(a, b) {
  return b = b.replace(new RegExp('"(\\d+)":', "g"), "$1:"), a.reduce(function (a, b, c) {
    var d = getLetter(c);return a.replace(new RegExp("" + JSON.stringify(b) + ":", "g"), d + ":").replace(new RegExp("([:,\\[])" + JSON.stringify(b), "g"), "$1" + d);
  }, b);
}function expand(a, b) {
  return b = b.replace(new RegExp("([{,])(\\d+):", "g"), '$1"$2":'), a.reduce(function (a, b, c) {
    var d = getLetter(c);return a.replace(new RegExp("" + d + ":", "g"), JSON.stringify(b) + ":").replace(new RegExp("([:,\\[])" + d, "g"), "$1" + JSON.stringify(b));
  }, b);
}function getLetter(a) {
  return a < 26 ? String.fromCharCode(A + a) : String.fromCharCode(A + Math.floor(a / 26 - 1)) + String.fromCharCode(A + a % 26);
}var A = "a".charCodeAt(0);

(function () {
  var global = document.onload ? document : window;
  if (global.performance) {
    global.onload = function () {
      if (!Date.now) Date.now = function () {
        return new Date().getTime();
      };
      var _window$performance = window.performance;
      var _window$performance$m = _window$performance.memory;
      var memory = _window$performance$m === undefined ? {} : _window$performance$m;
      var _window$performance$t = _window$performance.timing;
      var timing = _window$performance$t === undefined ? {} : _window$performance$t;

      var screen = window.screen || {};

      var memoryJSON = {};
      var timingJSON = {};
      var screenJSON = {};

      for (var mKey in memory) {
        memoryJSON[mKey] = memory[mKey];
      }
      for (var tKey in timing) {
        if (tKey !== 'toJSON') timingJSON[tKey] = timing[tKey];
      }
      for (var sKey in screen) {
        screenJSON[sKey] = screen[sKey];
      }

      var mKeys = Object.keys(memoryJSON);
      var tKeys = Object.keys(timingJSON);
      var sKeys = Object.keys(screenJSON);

      var m = c(mKeys, JSON.stringify(memoryJSON));
      var t = c(tKeys, JSON.stringify(timingJSON));
      var s = c(sKeys, JSON.stringify(screenJSON));
      var ts = Date.now();

      var PERF_AT_RELEASE = PERF_AT_RELEASE || '';
      var PERF_AT_COMMIT = PERF_AT_COMMIT || '';
      var PERF_AT_BRANCH = PERF_AT_BRANCH || '';
      var PERF_AT_STAGE = PERF_AT_STAGE || '';
      var PERF_AT_DEBUG = PERF_AT_DEBUG || true;

      var e = {
        pR: PERF_AT_RELEASE,
        pC: PERF_AT_COMMIT,
        pB: PERF_AT_BRANCH,
        pS: PERF_AT_STAGE
      };

      var event = encodeURIComponent(JSON.stringify({
        m: m,
        t: t,
        s: s,
        ts: ts,
        p: navigator.platform,
        l: navigator.language,
        u: navigator.userAgent,
        c: navigator.hardwareConcurrency,
        v: navigator.vendor,
        e: e
      }));

      if (PERF_AT_DEBUG) console.info(event);
      var el = document.createElement('img');
      el.src = "http://perf.at:5000/v1/" + event;
      document.body.appendChild(el);
    };
  }
})();
