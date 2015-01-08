var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.search = search = function(folder, asset, cb) {
  var options = { encoding: 'utf8' };
  fs.readFile(folder + asset, options, cb);
};

exports.respond = respond = function(res, data, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(data);
};

exports.prepareResponse = function(req, cb) {
  var data = "";
  req.on('data', function(chunk) { data += chunk; });
  req.on('end', function() { cb(data); });
};

exports.sendError = function(res) { respond(res, 'Not Found', 404); };

exports.serveAssets = function(res, asset, callback) {
  var pths = archive.paths;
  search(pths.siteAssets, asset, function(noPubAsset, data) {
    if (noPubAsset) {
      search(pths.archivedSites, asset, function(noArcAsset, data) {
        if (noArcAsset) {
          callback ? callback() : exports.sendError(res);
        } else {
          respond(res, data);
        }
      });
    } else {
      respond(res, data);
    }
  });
};
