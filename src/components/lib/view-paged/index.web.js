'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

var _react = require('react');

var _utils = require('../utils');

var _viewPagedHoc = require('../decorators/view-paged-hoc');

var _viewPagedHoc2 = _interopRequireDefault(_viewPagedHoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewPaged = (0, _viewPagedHoc2.default)(_class = function (_Component) {
  _inherits(ViewPaged, _Component);

  function ViewPaged(props) {
    _classCallCheck(this, ViewPaged);

    var _this = _possibleConstructorReturn(this, (ViewPaged.__proto__ || Object.getPrototypeOf(ViewPaged)).call(this, props));

    _this._onTouchStart = function (e) {
      e.stopPropagation();
      var targetTouche = (0, _utils.get)(e, 'targetTouches.0') || {};
      var clientX = targetTouche.clientX,
          clientY = targetTouche.clientY;

      _this._TouchStartEvent();

      _this.startX = clientX;
      _this.startY = clientY;
      // 是否为反向滚动
      _this.isScroll = false;
      // 是否达成触摸滑动操作，此类变量可用于web端区分点击事件
      _this.isTouch = false;
      // 是否判断过移动方向，只判断一次，判断过后不再判断
      _this.isMove = false;
    };

    _this._onTouchMove = function (e) {
      var targetTouche = (0, _utils.get)(e, 'targetTouches.0') || {};
      var clientX = targetTouche.clientX,
          clientY = targetTouche.clientY;
      var startX = _this.startX,
          startY = _this.startY;

      if (!_this.isMove) {
        _this.isMove = true;
        // 是否达成触摸滑动操作
        if (clientX !== startX || clientY !== startY) {
          _this.isTouch = true;
        }
        // 判断滚动方向是否正确
        var horDistance = Math.abs(clientX - startX);
        var verDistance = Math.abs(clientY - startY);
        var vertical = _this.props.vertical;

        if (vertical ? verDistance <= horDistance : horDistance <= verDistance) {
          _this.isScroll = true;
        }
      }

      if (!_this.isScroll) {
        e.stopPropagation();
        _this._TouchMoveEvent(targetTouche);
      }
      // 判断默认行为是否可以被禁用
      if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
          e.preventDefault();
        }
      }
    };

    _this._onTouchEnd = function (e) {
      var changedTouche = (0, _utils.get)(e, 'changedTouches.0') || {};
      var clientX = changedTouche.clientX,
          clientY = changedTouche.clientY;

      _this.endX = clientX;
      _this.endY = clientY;
      // 触发Move事件才能去判断是否跳转
      if (!_this.isScroll && _this.isMove) {
        _this._TouchEndEvent(changedTouche);
      }
    };

    _this._setAnimatedDivRef = function (ref) {
      if (ref && !_this._animatedDivRef) {
        _this._animatedDivRef = ref;
        // ReactDOM.findDOMNode(this._animatedDivRef)
        var divDom = (0, _utils.get)(ref, 'refs.node');
        // safari阻止拖动回弹，通过dom绑定事件
        divDom.addEventListener('touchmove', _this._onTouchMove, false);
      }
    };

    _this._onLayout = function (dom) {
      if (dom) {
        var _ref = dom || {},
            offsetWidth = _ref.offsetWidth,
            offsetHeight = _ref.offsetHeight;

        _this._runMeasurements(offsetWidth, offsetHeight);
      }
    };

    var locked = props.locked;


    _this._AnimatedViewProps = {};
    if (!locked) {
      _this._AnimatedViewProps = {
        onTouchStart: _this._onTouchStart,
        ref: _this._setAnimatedDivRef, // 代替move事件绑定
        // onTouchMove: this._onTouchMove,
        onTouchEnd: _this._onTouchEnd
      };
    }
    return _this;
  }

  _createClass(ViewPaged, [{
    key: '_getStyles',
    value: function _getStyles() {
      var vertical = this.props.vertical,
          _state = this.state,
          pos = _state.pos,
          isReady = _state.isReady;

      if (!isReady) return {};
      var basis = this.childrenSize * 100;
      var key = 'translate' + (vertical ? 'Y' : 'X');

      return {
        AnimatedStyle: {
          transform: [_defineProperty({}, key, pos)],
          flex: '1 0 ' + basis + '%'
        }
      };
    }
  }, {
    key: '_getDistance',
    value: function _getDistance(targetTouche) {
      var vertical = this.props.vertical;

      var suffix = vertical ? 'Y' : 'X';
      return targetTouche['client' + suffix] - this['start' + suffix];
    }
  }]);

  return ViewPaged;
}(_react.Component)) || _class;

exports.default = ViewPaged;