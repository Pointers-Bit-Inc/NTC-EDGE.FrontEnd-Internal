'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultProps = exports.propTypes = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = exports.propTypes = {
  style: _propTypes2.default.object,
  initialPage: _propTypes2.default.number,
  vertical: _propTypes2.default.bool,
  onChange: _propTypes2.default.func,
  duration: _propTypes2.default.number,
  withRef: _propTypes2.default.bool,
  infinite: _propTypes2.default.bool,
  renderHeader: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.element]),
  renderFooter: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.element]),
  renderPosition: _propTypes2.default.string,
  autoPlay: _propTypes2.default.bool,
  autoPlaySpeed: _propTypes2.default.number,
  hasAnimation: _propTypes2.default.bool,
  locked: _propTypes2.default.bool,
  preRenderRange: _propTypes2.default.number,
  isMovingRender: _propTypes2.default.bool
  // children: PropTypes.array.isRequired,
};

var defaultProps = exports.defaultProps = {
  style: {},
  initialPage: 0,
  vertical: true,
  onChange: _utils.noop,
  duration: 400,
  withRef: false,
  infinite: false,
  renderHeader: undefined,
  renderFooter: undefined,
  renderPosition: 'top',
  autoPlay: false,
  autoPlaySpeed: 2000,
  hasAnimation: true,
  locked: false,
  preRenderRange: 0,
  isMovingRender: false
};