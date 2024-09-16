'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewPaged = exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _decorators = require('./decorators');

var _viewPaged = require('./view-paged');

var _viewPaged2 = _interopRequireDefault(_viewPaged);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollPagedView = (0, _decorators.ScrollPagedHOC)(_class = function (_Component) {
  _inherits(ScrollPagedView, _Component);

  function ScrollPagedView() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ScrollPagedView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ScrollPagedView.__proto__ || Object.getPrototypeOf(ScrollPagedView)).call.apply(_ref, [this].concat(args))), _this), _this._onTouchStart = function (e) {
      var targetTouches = e.targetTouches;

      var _ref2 = targetTouches[0] || {},
          clientX = _ref2.clientX,
          clientY = _ref2.clientY;

      // 是否达成触摸滑动操作，此类变量可用于web端区分点击事件
      // 所有children共享类变量，从当前组件获取


      _this.isTouch = false;
      _this._TouchStartEvent(clientX, clientY);

      // web端在touchStart中设置一次边界值，这样做的好处是
      // 1 touchStart事件只触发一次，保证下次move事件必定取到最为准确的边界信息
      // 2 虽然touchEnd也只触发一次，但touchEnd的信息并不准确，在touchEnd后页面会滑行一段距离，此时又不得不监听onScroll事件
      //   1 关于滑行在safari上的处理不一致，在回弹时触发翻页时会在翻页onChange事件后继续触发onScroll事件
      //   2 这会导致计算的borderDirection值又会改变，状态又变为上一页的结束状态，且onScroll事件触发的次数也很多，无法监听结束状态
      // 3 所以放在touchStart事件中做处理最好，这里我受定势思维影响采用和Rn一样的处理方法，加入了onTouchEnd和onScroll事件来处理问题，其实根本原因在于RN的touchStart事件中取不到滚动元素的高度和滚动高度这些信息，所以才没在touchStart事件中处理
      _this._setBorderValue(e);
      // 记录开始的方向，用来在move事件中检验方向，只有方向一致才能发生翻页
      _this._startBorderDirection = _this.borderDirection;
    }, _this._onTouchMove = function (e) {
      var targetTouches = e.targetTouches;

      var _ref3 = targetTouches[0] || {},
          clientX = _ref3.clientX,
          clientY = _ref3.clientY;

      var _e$currentTarget = e.currentTarget,
          scrollHeight = _e$currentTarget.scrollHeight,
          scrollWidth = _e$currentTarget.scrollWidth,
          clientHeight = _e$currentTarget.clientHeight,
          clientWidth = _e$currentTarget.clientWidth;
      var vertical = _this.props.vertical;
      // 是否达成触摸滑动操作

      if (!_this.isTouch) {
        var _this2 = _this,
            startX = _this2.startX,
            startY = _this2.startY;

        if (clientX !== startX || clientY !== startY) {
          _this.isTouch = true;
        }
      }

      var sizeValue = vertical ? scrollHeight : scrollWidth;
      var layoutValue = vertical ? clientHeight : clientWidth;
      _this._TouchMoveEvent(clientX, clientY, sizeValue, layoutValue);

      // 边界不一致也停止冒泡
      if (!_this.isResponder || _this.borderDirection !== _this._startBorderDirection) {
        e.stopPropagation();
        // 到达边界时阻止默认事件
        if (_this.isResponder && _this.borderDirection) {
          if (e.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!e.defaultPrevented) {
              e.preventDefault();
            }
          }
        }
      } else if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
          e.preventDefault();
        }
      }
    }, _this._webSetScrollViewRef = function (ref) {
      _this._setScrollViewRef(ref);
      if (ref) {
        // safari阻止拖动回弹，通过dom绑定事件
        ref.addEventListener('touchmove', _this._onTouchMove, false);
      }
    }, _this.ScrollViewMonitor = function (_ref4) {
      var children = _ref4.children,
          _ref4$webProps = _ref4.webProps,
          webProps = _ref4$webProps === undefined ? {} : _ref4$webProps;
      var vertical = _this.props.vertical;

      var mergeProps = (0, _utils.getMergeObject)({
        onTouchStart: _this._onTouchStart,
        // onTouchMove: this._onTouchMove,
        // onTouchEnd: this._onTouchEnd,
        // onScroll: this._onScroll,
        style: {
          flex: 1,
          overflowX: vertical ? 'hidden' : 'scroll',
          overflowY: !vertical ? 'hidden' : 'scroll',
          position: 'relative',
          WebkitOverflowScrolling: 'touch'
        }
      }, webProps);

      return _react2.default.createElement(
        'div',
        _extends({}, mergeProps, {
          ref: _this._webSetScrollViewRef
        }),
        children
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ScrollPagedView, [{
    key: '_setBorderValue',
    value: function _setBorderValue(e) {
      var _e$currentTarget2 = e.currentTarget,
          scrollHeight = _e$currentTarget2.scrollHeight,
          scrollWidth = _e$currentTarget2.scrollWidth,
          scrollTop = _e$currentTarget2.scrollTop,
          scrollLeft = _e$currentTarget2.scrollLeft,
          clientHeight = _e$currentTarget2.clientHeight,
          clientWidth = _e$currentTarget2.clientWidth;
      var vertical = this.props.vertical;


      var startValue = vertical ? scrollTop : scrollLeft;
      var endValue = vertical ? clientHeight : clientWidth;
      var maxValue = vertical ? scrollHeight : scrollWidth;

      this.setBorderValue(startValue, endValue, maxValue);
    }

    // _onTouchEnd = (e) => {
    //   if(this.borderDirection) {
    //     if (e.cancelable) {
    //       // 判断默认行为是否已经被禁用
    //       if (!e.defaultPrevented) {
    //         e.preventDefault()
    //       }
    //     }
    //   }
    //   if (this.isTouchMove) {
    //     this._scrollEndCommon(e)
    //   }
    // }

    // _onScroll = (e) => {
    //   this._scrollEndCommon(e)
    // }

    // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载

  }]);

  return ScrollPagedView;
}(_react.Component)) || _class;

exports.default = ScrollPagedView;
exports.ViewPaged = _viewPaged2.default;