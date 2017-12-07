'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (apps) {
  if (!apps.length) {
    throw new Error('No Appid Found');
  }

  var tokenManagers = {};
  apps.map(function (_ref) {
    var appid = _ref.appid,
        secret = _ref.secret;

    var tokenManager = tokenManagers[appid] = {};
    tokenManager.instance = new _wechatToken2.default(appid, secret);
    tokenManager.instance.on('token', function (token) {
      tokenManager.error = null;
      tokenManager.accessToken = token;
    });

    tokenManager.instance.on('error', function (err) {
      tokenManager.error = err;
    });

    tokenManager.refresh = function () {
      return new _promise2.default(function (resolve) {
        tokenManager.instance.refresh(resolve);
      });
    };

    tokenManager.instance.start();
  });

  return tokenManagers;
};

var _wechatToken = require('wechat-token');

var _wechatToken2 = _interopRequireDefault(_wechatToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }