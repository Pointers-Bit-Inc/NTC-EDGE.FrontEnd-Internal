'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = ConnectHOC;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _propTypes = require('../prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function ConnectHOC(Inheritance) {
  var _class, _temp;

  var Connect = (_temp = _class = function (_Inheritance) {
    _inherits(Connect, _Inheritance);

    function Connect() {
      _classCallCheck(this, Connect);

      return _possibleConstructorReturn(this, (Connect.__proto__ || Object.getPrototypeOf(Connect)).apply(this, arguments));
    }

    _createClass(Connect, [{
      key: 'getChildren',
      value: function getChildren() {
        var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.children;
        var handleFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (child) {
          return child;
        };

        return _react2.default.Children.map(children, handleFunc);
      }
    }, {
      key: 'render',
      value: function render() {
        this.childrenList = this.getChildren();
        this.childrenSize = (0, _utils.size)(this.childrenList);
        // 记录初次children值
        this._childrenList = this.childrenList;
        this._childrenSize = this.childrenSize;

        return _get(Connect.prototype.__proto__ || Object.getPrototypeOf(Connect.prototype), 'render', this).call(this);
      }
    }]);

    return Connect;
  }(Inheritance), _class.propTypes = _propTypes.propTypes, _class.defaultProps = _propTypes.defaultProps, _class.displayName = 'HOC(' + (0, _utils.getDisplayName)((0, _utils.getPrototypeOf)(Inheritance)) + ')', _temp);


  return (0, _utils.copyStatic)(Connect, Inheritance, { finallyInherit: _react.Component });
}