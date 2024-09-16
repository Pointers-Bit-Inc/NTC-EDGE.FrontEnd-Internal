'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = exports.Easing = exports.AnimatedView = exports.Animated = exports.Style = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _common = require('./common');

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _common[key];
    }
  });
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('animated/lib/targets/react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Easing = require('animated/lib/Easing');

var _Easing2 = _interopRequireDefault(_Easing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var AnimatedView = _reactDom2.default.div;

var View = function View(props) {
  var onLayout = props.onLayout,
      otherProps = _objectWithoutProperties(props, ['onLayout']);

  var extraProps = {};
  if (onLayout) {
    extraProps.ref = onLayout;
  }

  return _react2.default.createElement('div', _extends({}, extraProps, otherProps));
};

var Style = {
  containerStyle: {
    flex: 1,
    display: 'flex',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%'
  },
  wrapStyle: {
    flex: 1,
    display: 'flex',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%'
  },
  AnimatedStyle: {
    flex: 1,
    display: 'flex'
  },
  pageStyle: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden'
  }
};

exports.Style = Style;
exports.Animated = _reactDom2.default;
exports.AnimatedView = AnimatedView;
exports.Easing = _Easing2.default;
exports.View = View;