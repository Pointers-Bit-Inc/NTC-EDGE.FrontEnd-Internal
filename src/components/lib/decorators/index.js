'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewPagedHOC = exports.ScrollPagedHOC = undefined;

var _scrollPagedHoc = require('./scroll-paged-hoc');

var _scrollPagedHoc2 = _interopRequireDefault(_scrollPagedHoc);

var _viewPagedHoc = require('./view-paged-hoc');

var _viewPagedHoc2 = _interopRequireDefault(_viewPagedHoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.ScrollPagedHOC = _scrollPagedHoc2.default;
exports.ViewPagedHOC = _viewPagedHoc2.default;