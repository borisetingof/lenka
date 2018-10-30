'use strict';

var fs = require('fs');
var path = require('path');

exports.get = function(event, context, callback) {
  var contents = fs.readFileSync(`public${path.sep}index.html`);
  var result = {
    statusCode: 200,
    body: {'boris': 'etingof'},
    headers: {'content-type': 'application/json'}
  };

  callback(null, result);
};
