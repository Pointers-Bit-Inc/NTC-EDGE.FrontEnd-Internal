'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultProps = exports.propTypes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultResponder = function defaultResponder(isResponder) {
  return function (evt, gestureState) {
    return isResponder;
  };
};

var propTypes = exports.propTypes = _extends({}, _common.propTypes, {
  onStartShouldSetPanResponder: _propTypes2.default.func,
  onStartShouldSetPanResponderCapture: _propTypes2.default.func,
  onMoveShouldSetPanResponder: _propTypes2.default.func,
  onMoveShouldSetPanResponderCapture: _propTypes2.default.func,
  onPanResponderTerminationRequest: _propTypes2.default.func,
  onShouldBlockNativeResponder: _propTypes2.default.func,
  onPanResponderTerminate: _propTypes2.default.func,
  useScrollView: _propTypes2.default.bool,
  scrollViewProps: _propTypes2.default.object
});

var defaultProps = exports.defaultProps = _extends({}, _common.defaultProps, {
  onStartShouldSetPanResponder: defaultResponder(true),
  onStartShouldSetPanResponderCapture: defaultResponder(false),
  onMoveShouldSetPanResponder: defaultResponder(true),
  onMoveShouldSetPanResponderCapture: defaultResponder(false),
  onPanResponderTerminationRequest: defaultResponder(true),
  onShouldBlockNativeResponder: defaultResponder(true),
  onPanResponderTerminate: _utils.noop,
  useScrollView: true,
  scrollViewProps: {}
});