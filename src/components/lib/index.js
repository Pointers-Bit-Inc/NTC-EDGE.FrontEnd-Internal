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

var _components = require('./components');

var _viewPaged = require('./view-paged');

var _viewPaged2 = _interopRequireDefault(_viewPaged);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollPagedView = (0, _decorators.ScrollPagedHOC)(_class = function (_Component) {
  _inherits(ScrollPagedView, _Component);

  function ScrollPagedView(props) {
    _classCallCheck(this, ScrollPagedView);

    var _this = _possibleConstructorReturn(this, (ScrollPagedView.__proto__ || Object.getPrototypeOf(ScrollPagedView)).call(this, props));

    _this._onContentSizeChange = function (oldSize, newSize) {
      // 修复高度变化后边界已判断操作,只有第一页需要判断
      if (!(0, _utils.isEmpty)(oldSize)) {
        var isResponder = _this.isResponder,
            vertical = _this.props.vertical;

        var newValue = vertical ? newSize.height : newSize.width;
        var oldValue = vertical ? oldSize.height : oldSize.width;

        if (isResponder && newValue > oldValue) {
          _this.isBorder = false;
          _this.borderDirection = false;
          _this.setResponder(false);
        }
      }
    };

    _this._onTouchStart = function (_ref, _ref2) {
      var nativeEvent = _ref.nativeEvent;
      var scrollViewRef = _ref2.scrollViewRef;
      var pageX = nativeEvent.pageX,
          pageY = nativeEvent.pageY;

      _this.currentRef = scrollViewRef;

      _this._TouchStartEvent(pageX, pageY);
    };

    _this._onScrollEndDrag = function (event) {
      // if (isAndroid && this.androidMove) {
      //   this.androidMove = false
      // const currentRef = this.getScrollViewConfig('scrollViewRef')

      // this._startTime = Date.now()
      // this._onUpdate(this._fromValue, (y) => {
      //   currentRef.scrollTo({ x: 0, y, animated: false })
      // })
      // }

      _this._onMomentumScrollEnd(event);
    };

    _this._onMomentumScrollEnd = function (_ref3) {
      var nativeEvent = _ref3.nativeEvent;

      if (_this.isTouchMove) {
        var vertical = _this.props.vertical;
        var _nativeEvent$contentO = nativeEvent.contentOffset,
            y = _nativeEvent$contentO.y,
            x = _nativeEvent$contentO.x,
            _nativeEvent$contentS = nativeEvent.contentSize,
            maxHeight = _nativeEvent$contentS.height,
            maxWidth = _nativeEvent$contentS.width,
            _nativeEvent$layoutMe = nativeEvent.layoutMeasurement,
            height = _nativeEvent$layoutMe.height,
            width = _nativeEvent$layoutMe.width;

        var startValue = vertical ? y : x;
        var endValue = vertical ? height : width;
        var maxValue = vertical ? maxHeight : maxWidth;

        _this.setBorderValue(startValue, endValue, maxValue);
      }
    };

    _this._onTouchMove = function (_ref4, _ref5) {
      var nativeEvent = _ref4.nativeEvent;
      var scrollViewSize = _ref5.scrollViewSize,
          scrollViewLayout = _ref5.scrollViewLayout;
      var pageX = nativeEvent.pageX,
          pageY = nativeEvent.pageY;
      var vertical = _this.props.vertical;


      var sizeValue = vertical ? scrollViewSize.height : scrollViewSize.width;
      var layoutValue = vertical ? scrollViewLayout.height : scrollViewLayout.width;
      _this._TouchMoveEvent(pageX, pageY, sizeValue, layoutValue);
    };

    _this.ScrollViewMonitor = function (_ref6) {
      var children = _ref6.children,
          _ref6$nativeProps = _ref6.nativeProps,
          nativeProps = _ref6$nativeProps === undefined ? {} : _ref6$nativeProps;
      var vertical = _this.props.vertical;

      var mergeProps = (0, _utils.getMergeObject)({
        onContentSizeChange: _this._onContentSizeChange,
        onMomentumScrollEnd: _this._onMomentumScrollEnd,
        onScrollEndDrag: _this._onScrollEndDrag,
        onTouchStart: _this._onTouchStart,
        onTouchMove: _this._onTouchMove,
        // onTouchEnd: this._onTouchEnd,
        showsVerticalScrollIndicator: false,
        bounces: false,
        style: { flex: 1 }
      }, nativeProps);

      return _react2.default.createElement(
        _components.AgentScrollView,
        _extends({}, mergeProps, {
          ref: _this._setScrollViewRef,
          horizontal: !vertical
        }),
        children
      );
    };

    _this._startResponder = function () {
      return false;
    };

    _this._moveResponder = function () {
      return _this.isResponder;
    };

    _this._startResponderCapture = function () {
      return false;
    };

    _this._moveResponderCapture = function () {
      return _this.isResponder;
    };

    _this._onPanResponderTerminationRequest = function () {
      return !_this.isResponder;
    };

    _this._viewPagedProps = {
      onStartShouldSetPanResponder: _this._startResponder,
      onMoveShouldSetPanResponder: _this._moveResponder,
      onStartShouldSetPanResponderCapture: _this._startResponderCapture,
      onMoveShouldSetPanResponderCapture: _this._moveResponderCapture,
      onPanResponderTerminationRequest: _this._onPanResponderTerminationRequest
      // onShouldBlockNativeResponder: this._onShouldBlockNativeResponder,
      // onPanResponderTerminate: this._onPanResponderTerminate,
    };
    return _this;
  }

  // 暂未观测出设置的先后顺序影响


  _createClass(ScrollPagedView, [{
    key: 'setResponder',


    // _onShouldBlockNativeResponder = () => {
    //   return false
    // }

    // _onPanResponderTerminate = () => {
    //   if (this.isResponder) {
    //     this.setResponder(false)

    //     this.isTerminate = true
    //   } else {
    //     this.isTerminate = false
    //   }
    // }
    value: function setResponder(flag) {
      if (_utils.isAndroid) {
        if (this.currentRef) {
          this.currentRef.setScrollEnabled(!flag);
          // this.currentRef.setNativeProps({
          //   scrollEnabled: !flag,
          // })
        }
      }
    }

    // _onTouchEnd = () => {
    //   if (isAndroid && this.androidMove) {
    //     const currentRef = this.getScrollViewConfig('scrollViewRef')
    //     this._startTime = Date.now()
    //     this.onUpdate(this._fromValue, (y) => {
    //       console.log(y)
    //       currentRef.scrollTo({ x: 0, y, animated: false })
    //     })

    //     this.androidMove = false
    //   }
    // }

    // 子元素调用一定要传入index值来索引对应数据,且最好执行懒加载

  }]);

  return ScrollPagedView;
}(_react.Component)) || _class;

exports.default = ScrollPagedView;
exports.ViewPaged = _viewPaged2.default;