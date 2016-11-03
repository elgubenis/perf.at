const express = require('express');
const app = express();

const mKeys = ['totalJSHeapSize', 'usedJSHeapSize', 'jsHeapSizeLimit'];
const tKeys = ['navigationStart', 'unloadEventStart', 'unloadEventEnd', 'redirectStart', 'redirectEnd', 'fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'secureConnectionStart', 'requestStart', 'responseStart', 'responseEnd', 'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd'];
const sKeys = ['availWidth', 'availHeight', 'width', 'height', 'colorDepth', 'pixelDepth', 'availLeft', 'availTop', 'orientation'];

function c(a,b){return b=b.replace(new RegExp('"(\\d+)":',"g"),"$1:"),a.reduce(function(a,b,c){var d=getLetter(c);return a.replace(new RegExp(""+JSON.stringify(b)+":","g"),d+":").replace(new RegExp("([:,\\[])"+JSON.stringify(b),"g"),"$1"+d)},b)}function expand(a,b){return b=b.replace(new RegExp("([{,])(\\d+):","g"),'$1"$2":'),a.reduce(function(a,b,c){var d=getLetter(c);return a.replace(new RegExp(""+d+":","g"),JSON.stringify(b)+":").replace(new RegExp("([:,\\[])"+d,"g"),"$1"+JSON.stringify(b))},b)}function getLetter(a){return a<26?String.fromCharCode(A+a):String.fromCharCode(A+Math.floor(a/26-1))+String.fromCharCode(A+a%26)}var A="a".charCodeAt(0);

const Handlebars = require('handlebars');

Handlebars.registerHelper('calcHeight', function (index) {
  return index * 25;
});

const result = Handlebars.compile(`
<div style="width: 100%; overflow: auto; height: 100%; position: relative;">
  {{#each globalArr}}
    <div style="top: {{calcHeight @index}}px; background: red; position: absolute; left: {{start}}px; height: 20px; width: {{span}}px;">{{label}}</div>
  {{/each}}
</div>
`);

let globalArr = [ { start: 0, span: 113, label: 'connecting' },                                                                                                                                  
  { start: 113, span: 7, label: 'idle' },                                                                                                                                        
  { start: 120, span: 755, label: 'execute after' },                                                                                                                             
  { start: 876, span: 4, label: 'execute asap' },                                                                                                                                
  { start: 120, span: 1644, label: 'dom ready' } ];

app.get('/v1/:encoded', (req, res) => {
  const encoded = JSON.parse(req.params.encoded);
  const memory = JSON.parse(expand(mKeys, encoded.m));
  const timing = JSON.parse(expand(tKeys, encoded.t));
  const screen = JSON.parse(expand(sKeys, encoded.s));
  const timestamp = encoded.ts;
  const platform = encoded.p;
  const language = encoded.l;
  const userAgent = encoded.u;
  const concurrency = encoded.c;
  const vendor = encoded.v;
  const environment = encoded.e;
  const location = encoded.d;
  const onLine = encoded.o;


  const lowestTiming = timing.navigationStart;
  for (let tKey in timing) {
    if (timing[tKey] !== 0) timing[tKey] = timing[tKey] - lowestTiming;
  }
  const connection = timing.responseEnd - timing.navigationStart;
  const idle = timing.domLoading - timing.responseEnd;
  const dom = timing.domComplete - timing.domContentLoadedEventStart;
  const scriptsExecutedAfterParse = timing.domInteractive - timing.domLoading;
  const scriptsExecutedAsap = timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart;
  const arr = [];
  arr.push({ start: timing.navigationStart, span: connection, label: 'connecting' });
  arr.push({ start: timing.responseEnd, span: idle, label: 'idle' });
  arr.push({ start: timing.domLoading, span: scriptsExecutedAfterParse, label: 'execute after' });
  arr.push({ start: timing.domContentLoadedEventStart, span: scriptsExecutedAsap, label: 'execute asap' });
  arr.push({ start: timing.domContentLoadedEventEnd, span: dom, label: 'dom ready' });
  globalArr = arr;
  console.log(arr);
});

app.get('/draw', (req, res, next) => {
  res.send(result({ globalArr }));
});

app.listen(5000);
