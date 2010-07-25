/**
 * spider.js
 */

var http = require("http"),
    sys = require("sys"),
    URL = require("url");

URL.normalize = URL.normalize || function(obj) {
  if (!obj || typeof(obj) !== "object" || !obj.href) return obj;

  var defaults = {
    "http:" : {
      port : 80
    },
    "https:" : {
      port : 443
    }
  };

  obj.port = obj.port || defaults[obj.protocol].port || null;
  obj.path = obj.path || "/";

  return obj;
};

var dom = require("../deps/jsdom/lib/jsdom/level1/core").dom.level1.core;
var htmlparser = require("../deps/htmlparser/lib/node-htmlparser");
var browser = require("../deps/jsdom/lib/jsdom/browser/index").windowAugmentation(dom, {parser: htmlparser});
var SIZZLE = require("../deps/sizzle");


/*-----------------------------------------------
  Spider Exports:
-----------------------------------------------*/
exports.Spider = Spider;

/*-----------------------------------------------
  Spider Implementation:
-----------------------------------------------*/
function Spider() {};

Spider.prototype.crawl = function(url) {
  var uri = URL.parse(url);
  uri = URL.normalize(uri);

  var client = this.client = http.createClient(uri.port, uri.hostname);

  var request = client.request("GET", uri.path, {"host" : uri.hostname});
  request.end();

  request.on("response", function(response) {
    var body = "";
    response.on("data", function(chunk) {
      body += chunk;
    });
    response.on("end", function() {
      var document = browser.document;
      document.innerHTML = body;

      var sizzle = SIZZLE.sizzleInit({}, document);
      var anchors = sizzle("a");
      console.log("anchors: "+anchors.length);

      anchors.forEach(function(a) {
        console.log(a.href);
      });
    });
  });
};


