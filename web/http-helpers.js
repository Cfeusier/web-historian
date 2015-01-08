var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var search = archive.search;

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  'Content-Type': "text/html"
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

exports.sendError = sendError = function(res) {
  exports.respond(res, 'Not Found', 404);
};

exports.redirector = function(res, loc, status) {
  status = status || 302;
  res.writeHead(status, { Location: loc });
  res.end();
};

exports.serveAssets = function(res, asset, cb) {
  var pths = archive.paths;
  search(pths.siteAssets, asset, function(noPubAsset, data) {
    if (noPubAsset) {
      search(pths.archivedSites, asset, function(noArcAsset, data) {
        if (noArcAsset) { cb ? cb() : sendError(res); }
        else { respond(res, data); }
      });
    } else { respond(res, data); }
  });
};
