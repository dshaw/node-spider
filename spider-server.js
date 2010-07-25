/**
 * spider-server.js
 */

require.paths.unshift("lib/");

var Spider = require("spider").Spider;

var spider = new Spider();
spider.crawl("http://dshaw.com/");

