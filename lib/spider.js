/**
 * spider.js
 */

var http = require("http"),
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

var hrefPattern = /^([a-z0-9]+:)/; // returns value of href in an anchor tag.

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
    bucket = [];
    response.on("data", function(chunk) {
      //console.log("BODY: "+chunk);
      bucket[bucket.length] = chunk; // NOT SURE IT REALLY MAKES ANY SENSE TO NOT
                                     // CONCATENATE THIS RIGHT HERE, BUT RUNNING WITH IT FOR NOW.
    });
    response.on("end", function() {
      var body = "",
          urls = [];
      console.log("bucket size: "+bucket.length);
      for (var i = 0, len = bucket.length; i<len; i++) {
        //console.log("bucket["+i+"]: "+bucket[i].slice(0,100));
        //console.log("bucket["+i+"]: "+bucket[i]);
        body += bucket[i];
        console.log(body);
      }
    });
  });
};


