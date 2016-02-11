'use strict';

var _micro = require('micro');

var _micro2 = _interopRequireDefault(_micro);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _micro2.default)(_app2.default).listen(_config2.default.port, function () {
  console.log('server listening ' + _config2.default.port);
}); /* eslint-disable no-console */