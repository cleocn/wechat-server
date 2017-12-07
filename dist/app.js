'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _micro = require('micro');

var _url = require('url');

var _http = require('http');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _agent = require('./agent');

var _agent2 = _interopRequireDefault(_agent);

var _tokenManagerFactory = require('./token-manager-factory');

var _tokenManagerFactory2 = _interopRequireDefault(_tokenManagerFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apps = _config2.default.apps,
    auth = _config2.default.auth;

var tokenManagers = (0, _tokenManagerFactory2.default)(apps);

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var appid, tokenManager, result, force, error, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _assign2.default)(req, (0, _url.parse)(req.url, true));

            if (auth(req)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return', (0, _micro.send)(res, 401, _http.STATUS_CODES[401]));

          case 3:
            appid = req.query && req.query.appid;

            if (!(!appid || !tokenManagers[appid])) {
              _context.next = 6;
              break;
            }

            return _context.abrupt('return', (0, _micro.send)(res, 404, 'APPID ' + _http.STATUS_CODES[404]));

          case 6:
            tokenManager = tokenManagers[appid];

            // proxy wechat api

            if (!/cgi-bin/.test(req.pathname)) {
              _context.next = 19;
              break;
            }

            result = void 0;
            _context.prev = 9;
            _context.next = 12;
            return (0, _agent2.default)(req, tokenManager);

          case 12:
            result = _context.sent;
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](9);
            return _context.abrupt('return', (0, _micro.send)(res, 400, _context.t0));

          case 18:
            return _context.abrupt('return', (0, _micro.send)(res, 200, result));

          case 19:

            // show access_token
            force = false;

            if (req.pathname === '/refresh') force = true;

            error = tokenManager.error;

            if (!error) {
              _context.next = 24;
              break;
            }

            return _context.abrupt('return', (0, _micro.send)(res, 400, error));

          case 24:
            if (!force) {
              _context.next = 27;
              break;
            }

            tokenManager.instance.refresh(function (token) {
              (0, _micro.send)(res, 200, token);
            });
            return _context.abrupt('return', 1);

          case 27:
            data = tokenManager.accessToken;

            (0, _micro.send)(res, 200, data);

          case 29:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[9, 15]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();