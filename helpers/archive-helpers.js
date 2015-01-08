var http = require('http');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt'),
  'logs' : path.join(__dirname, '../workers/logs')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(cb) {
  fs.readFile(exports.paths.list, function(err, sites) {
    sites = sites.toString().split('\n');
    cb ? cb(sites) : null;
  });
};

exports.isUrlInList = function(url, cb) {
  exports.readListOfUrls(function(sites) {
    var matched = false;
    for (var i = 0; i < sites.length; i++) {
      matched = sites[i].match(url) ? true : matched;
    }
    cb(matched);
  });
};

exports.search = search = function(folder, asset, cb) {
  var options = { encoding: 'utf8' };
  fs.readFile(folder + '/' + asset, options, cb);
};

exports.addUrlToList = function(siteName, cb) {
  fs.appendFile(exports.paths.list, siteName + "\n", function() { cb ? cb() : null; });
};

exports.isURLArchived = function(url, cb) {
  search(exports.paths.archivedSites, url, function(resourceFound) {
    cb ? cb(resourceFound) : null;
  });
};

exports.downloadUrls = function(cb) {
  exports.readListOfUrls(function(siteNames) {
    _.each(siteNames, function(site) {
      http.get('http://' + site, function(res) {
        // html = res.body
        //write html to new file in sites/ with filename matching url
        // remove site from sites.txt list
        fs.appendFile(exports.paths.logs, res.buffer.toString());
      }).on('error', function(err) {0
        fs.appendFile(exports.paths.logs, err.message);
        exports.addUrlToList(site);
      });
    });
    cb ? cb() : null;
  });
};

