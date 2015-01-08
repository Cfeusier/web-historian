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

exports.serveAssets = function(res, asset, callback) {
  var options = { encoding: 'utf8' };

  // TODO: refactor into helpers
  fs.readFile(archive.paths.siteAssets+asset, options.encoding, function(err, data){
    if( err ){
      fs.readFile( archive.paths.archivedSites+asset, options.encoding, function(err, data){
        if( err ){
          if (callback) {
            callback();
          } else {
            exports.sendError(res);
          }
        } else {
          exports.respond(res, data);
        }
      });
    } else {
      exports.respond(res, data);
    }
  });
};

exports.respond = function(res, data, statusCode){
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(data);
};

exports.prepareResponse = function(req, cb){
  var data = "";
  req.on('data', function(chunk) { data += chunk; });
  req.on('end', function() { cb(data); });
};

exports.sendError = function(res){
  exports.respond(res, 'not Found', 404);
};


