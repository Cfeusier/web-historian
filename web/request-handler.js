var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var parser = require('url');

var mtds = {
  'GET': function(req, res) {
    var urlPts = parser.parse(req.url);
    var endPoint = urlPts.pathname === '/' ? '/index.html' : urlPts.pathname;
    utils.serveAssets(res, endPoint, function() {
      archive.isUrlInList(endPoint.slice(1), function(isFnd) {
        isFnd ? utils.redirector(res, '/loading.html') : utils.sendError(res);
      });
    });
  },
  'POST': function(req, res) {
    utils.prepareResponse(req, function(data) {
      // TODO: handle http(s):// cases
      var siteName = data.split('=')[1];
      archive.isUrlInList(siteName, function(urlFound) {
        if (urlFound) {
          archive.isURLArchived(siteName, function(urlArchived) {
            if (urlArchived) {
              utils.redirector(res, '/' + siteName);
            } else {
              utils.redirector(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(siteName, function() {
            utils.redirector(res, '/loading.html');
          });
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  var action = mtds[req.method];
  action ? action(req, res) : utils.sendError(res);
};
