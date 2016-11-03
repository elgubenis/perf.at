function c(a,b){return b=b.replace(new RegExp('"(\\d+)":',"g"),"$1:"),a.reduce(function(a,b,c){var d=getLetter(c);return a.replace(new RegExp(""+JSON.stringify(b)+":","g"),d+":").replace(new RegExp("([:,\\[])"+JSON.stringify(b),"g"),"$1"+d)},b)}function expand(a,b){return b=b.replace(new RegExp("([{,])(\\d+):","g"),'$1"$2":'),a.reduce(function(a,b,c){var d=getLetter(c);return a.replace(new RegExp(""+d+":","g"),JSON.stringify(b)+":").replace(new RegExp("([:,\\[])"+d,"g"),"$1"+JSON.stringify(b))},b)}function getLetter(a){return a<26?String.fromCharCode(A+a):String.fromCharCode(A+Math.floor(a/26-1))+String.fromCharCode(A+a%26)}var A="a".charCodeAt(0);

(function () {
  const global = document.onload ? document : window;
  if (window.performance) {
    global.onload = () => {
      if (!Date.now) Date.now = () => new Date().getTime();
      const { memory = {}, timing = {} } = window.performance;
      const screen = window.screen || {};

      const memoryJSON = {};
      const timingJSON = {};
      const screenJSON = {};

      for (let mKey in memory) { memoryJSON[mKey] = memory[mKey]; }
      for (let tKey in timing) { if (tKey !== 'toJSON') timingJSON[tKey] = timing[tKey]; }
      for (let sKey in screen) { screenJSON[sKey] = screen[sKey]; }

      const mKeys = Object.keys(memoryJSON);
      const tKeys = Object.keys(timingJSON);
      const sKeys = Object.keys(screenJSON);

      const m = c(mKeys, JSON.stringify(memoryJSON));
      const t = c(tKeys, JSON.stringify(timingJSON));
      const s = c(sKeys, JSON.stringify(screenJSON));
      const ts = Date.now();

      const PERF_AT_RELEASE = PERF_AT_RELEASE || '';
      const PERF_AT_COMMIT = PERF_AT_COMMIT || '';
      const PERF_AT_BRANCH = PERF_AT_BRANCH || '';
      const PERF_AT_STAGE = PERF_AT_STAGE || '';
      const PERF_AT_DEBUG = PERF_AT_DEBUG || true;
      const PERF_AT_TAGS = PERF_AT_TAGS || [];

      const e = {
        pR: PERF_AT_RELEASE,
        pC: PERF_AT_COMMIT,
        pB: PERF_AT_BRANCH,
        pS: PERF_AT_STAGE,
        pT: PERF_AT_TAGS,
      };

      const d = JSON.parse(JSON.stringify(document.location));

      const event = encodeURIComponent(JSON.stringify({
        m,
        t,
        s,
        ts,
        d,
        p: navigator.platform,
        l: navigator.language,
        u: navigator.userAgent,
        c: navigator.hardwareConcurrency,
        v: navigator.vendor,
        o: navigator.onLine,
        e,
      }));

      if (PERF_AT_DEBUG) console.info(event);
      const el = document.createElement('img');
      el.src = `http://perf.at:5000/v1/${event}`;
      document.body.appendChild(el);
    };
  }
}());

