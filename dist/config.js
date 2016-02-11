'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var WX_APPS = process.env.WX_APPS;


var apps = [];

// set apps by process.env
WX_APPS.split(',').map(function (item) {
  return item.split(':');
}).map(function (_ref) {
  var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

  var appid = _ref2[0];
  var secret = _ref2[1];

  apps.push({ appid: appid, secret: secret });
});

// set apps manual
// apps.push({ appid: 'appid', secret: 'secret' })

exports.default = {
  apps: apps,
  port: 3000,

  // override this auth method by your self
  auth: function auth(req) {
    var AUTH_ENABLE = process.env.AUTH_ENABLE;

    if (AUTH_ENABLE === '0') return true;

    var _process$env = process.env;
    var USERNAME = _process$env.USERNAME;
    var PASSWORD = _process$env.PASSWORD;

    // by query params

    var query = req.query;
    if (query && query.username && query.password) {
      var username = query.username;
      var password = query.password;

      if (username === USERNAME && password === PASSWORD) return true;
    } else {
      // by authorization header
      if (!req.headers.authorization) return false;

      var encoded = req.headers.authorization.split(' ')[1];
      var decoded = new Buffer(encoded, 'base64').toString('utf8');

      var _decoded$split = decoded.split(':');

      var _decoded$split2 = (0, _slicedToArray3.default)(_decoded$split, 2);

      var username = _decoded$split2[0];
      var password = _decoded$split2[1];


      if (username === USERNAME && password === PASSWORD) return true;
    }

    return false;
  }
};