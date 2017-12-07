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

var _process$env = process.env,
    WX_APPS = _process$env.WX_APPS,
    SERVER_PORT = _process$env.SERVER_PORT;


var apps = [];

// set apps by process.env
WX_APPS.split(',').map(function (item) {
  return item.split(':');
}).map(function (_ref) {
  var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
      appid = _ref2[0],
      secret = _ref2[1];

  apps.push({ appid: appid, secret: secret });
});

// set apps manual
// apps.push({ appid: 'appid', secret: 'secret' })

exports.default = {
  apps: apps,
  port: SERVER_PORT || 3001,

  // override this auth method by your self
  auth: function auth(req) {
    var AUTH_ENABLE = process.env.AUTH_ENABLE;

    if (AUTH_ENABLE === '0') return true;

    var _process$env2 = process.env,
        USERNAME = _process$env2.USERNAME,
        PASSWORD = _process$env2.PASSWORD;

    // by query params

    var query = req.query;
    if (query && query.username && query.password) {
      var username = query.username,
          password = query.password;

      if (username === USERNAME && password === PASSWORD) return true;
    } else {
      // by authorization header
      if (!req.headers.authorization) return false;

      var encoded = req.headers.authorization.split(' ')[1];
      var decoded = new Buffer(encoded, 'base64').toString('utf8');

      var _decoded$split = decoded.split(':'),
          _decoded$split2 = (0, _slicedToArray3.default)(_decoded$split, 2),
          _username = _decoded$split2[0],
          _password = _decoded$split2[1];

      if (_username === USERNAME && _password === PASSWORD) return true;
    }

    return false;
  }
};