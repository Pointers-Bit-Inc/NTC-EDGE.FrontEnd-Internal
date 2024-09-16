'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAndroid = exports.isIOS = undefined;

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

var isIOS = exports.isIOS = _reactNative.Platform.OS === 'ios';

var isAndroid = exports.isAndroid = _reactNative.Platform.OS === 'android';