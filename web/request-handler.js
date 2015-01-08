var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var urlParser = require('url');

var mtds = {
  'GET': function(req, res) {
    var urlParts = urlParser.parse(req.url);
    var endPoint = urlParts.pathname === '/' ? '/index.html' : urlParts.pathname;

    utils.serveAssets(res, endPoint, function(){
      archive.isUrlInList(endPoint.slice(1), function(isFound){
        if( isFound ){
          utils.respond(res, '/loading.html');
        } else {
          utils.sendError(res);
        }
      });
    });
  },
  'POST': function(req, res) {
    // handle post
  }
};


exports.handleRequest = function (req, res) {
  var action = mtds[req.method];
  if (action) {
    action(req, res);
  } else {
    utils.sendError(res);
  }
};
