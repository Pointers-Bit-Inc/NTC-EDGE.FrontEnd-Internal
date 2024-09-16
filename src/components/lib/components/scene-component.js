'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ = require('./');

var _staticContainer = require('./static-container');

var _staticContainer2 = _interopRequireDefault(_staticContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (_ref) {
  var shouldUpdated = _ref.shouldUpdated,
      children = _ref.children,
      otherProps = _objectWithoutProperties(_ref, ['shouldUpdated', 'children']);

  return _react2.default.createElement(
    _.View,
    otherProps,
    _react2.default.createElement(
      _staticContainer2.default,
      { shouldUpdate: shouldUpdated },
      children
    )
  );
};