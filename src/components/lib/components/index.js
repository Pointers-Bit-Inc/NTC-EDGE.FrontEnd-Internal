'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AgentScrollView = exports.View = exports.Easing = exports.AnimatedView = exports.Animated = exports.Style = undefined;

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

var _reactNative = require('react-native');

var _agentScrollView = require('./agent-scroll-view');

var _agentScrollView2 = _interopRequireDefault(_agentScrollView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AnimatedView = _reactNative.Animated.View;

var Style = {
  containerStyle: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  wrapStyle: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  AnimatedStyle: {
    flex: 1
  },
  pageStyle: {}
};

exports.Style = Style;
exports.Animated = _reactNative.Animated;
exports.AnimatedView = AnimatedView;
exports.Easing = _reactNative.Easing;
exports.View = _reactNative.View;
exports.AgentScrollView = _agentScrollView2.default;