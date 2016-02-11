'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _micro = require('micro');

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, tokenManager) {
    var query, body, opts, result, errcode;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            query = req.query;

            query.access_token = tokenManager.accessToken;

            body = undefined;

            if (!(req.method === 'POST')) {
              _context.next = 7;
              break;
            }

            _context.next = 6;
            return (0, _micro.json)(req);

          case 6:
            body = _context.sent;

          case 7:
            opts = {
              uri: req.pathname,
              baseUrl: 'https://api.weixin.qq.com/',
              qs: query,
              method: req.method,
              body: body,
              json: true
            };
            _context.next = 10;
            return (0, _requestPromise2.default)(opts);

          case 10:
            result = _context.sent;
            errcode = parseInt(result.errcode, 10);

            if (! ~[40001, 40014, 42001].indexOf(errcode)) {
              _context.next = 18;
              break;
            }

            _context.next = 15;
            return tokenManager.refresh();

          case 15:
            _context.next = 17;
            return (0, _requestPromise2.default)(opts);

          case 17:
            result = _context.sent;

          case 18:
            return _context.abrupt('return', result);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
}();