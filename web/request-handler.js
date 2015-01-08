var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var urlParser = require('url');

var mtds = {
  'GET': function(req, res) {
    var urlParts = urlParser.parse(req.url);
    var endPoint = urlParts.pathname === '/' ? '/index.html' : urlParts.pathname;

    utils.serveAssets(res, endPoint, function() {
      archive.isUrlInList(endPoint.slice(1), function(isFound) {
        isFound ? utils.respond(res, '/loading.html') : utils.sendError(res);
      });
    });
  },
  'POST': function(req, res) {}
};

exports.handleRequest = function (req, res) {
  var action = mtds[req.method];
  action ? action(req, res) : utils.sendError(res);
};
