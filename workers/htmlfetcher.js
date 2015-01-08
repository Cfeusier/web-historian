var archive = require('../helpers/archive-helpers');

exports.workHard = function() {
  archive.downloadUrls(function() { return; });
};

exports.workHard();