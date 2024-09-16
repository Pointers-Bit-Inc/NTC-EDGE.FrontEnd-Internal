'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _viewPagedHoc = require('../decorators/view-paged-hoc');

var _viewPagedHoc2 = _interopRequireDefault(_viewPagedHoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var panResponderKey = ['onStartShouldSetPanResponder', 'onStartShouldSetPanResponderCapture', 'onMoveShouldSetPanResponder', 'onMoveShouldSetPanResponderCapture', 'onPanResponderTerminationRequest', 'onPanResponderTerminate', 'onShouldBlockNativeResponder'];

var ViewPaged = (0, _viewPagedHoc2.default)(_class = function (_Component) {
  _inherits(ViewPaged, _Component);

  function ViewPaged(props) {
    _classCallCheck(this, ViewPaged);

    var _this = _possibleConstructorReturn(this, (ViewPaged.__proto__ || Object.getPrototypeOf(ViewPaged)).call(this, props));

    _this._onPanResponderGrant = function (evt, gestureState) {
      _this._TouchStartEvent();
    };

    _this._onPanResponderMove = function (evt, gestureState) {
      _this._TouchMoveEvent(gestureState);
    };

    _this._onPanResponderRelease = function (evt, gestureState) {
      _this._TouchEndEvent(gestureState);
    };

    _this._onLayout = function (_ref) {
      var nativeEvent = _ref.nativeEvent;

      var _ref2 = nativeEvent.layout || {},
          width = _ref2.width,
          height = _ref2.height;

      _this._runMeasurements(width, height);
    };

    _this._scrollToPage = function () {
      var posPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this._posPage;
      var hasAnimation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.props.hasAnimation;
      var width = _this.state.width;

      _this._posPage = posPage;

      var offset = _this._posPage * width;
      if (_this.scrollView) {
        var animated = hasAnimation;
        _this.scrollView.getNode().scrollTo({ x: offset, y: 0, animated: animated });
      }

      _this._onChange();
    };

    _this._onScroll = function (event) {
      // const { nativeEvent } = event
      var onScroll = _this.props.onScroll;
      // const { x } = nativeEvent.contentOffset

      // // 优化体验，提前预知需要加载的下一页，避免监听onMomentumScrollEnd需等待滚动结束后才开始加载
      // if (!this._referX) {
      //   this._referX = x
      // } else if (!this._startDirection) {
      //   this._startDirection = x > this._referX ? 'right' : 'left'
      // } else if (this._isTouchEnd) {
      //   const _endDirection = x > this._referX ? 'right' : 'left'
      //   if (this._startDirection === _endDirection) {
      //     let newPosPage = this._posPage
      //     if (_endDirection === 'right') {
      //       newPosPage = this._posPage + 1
      //     } else {
      //       newPosPage = this._posPage - 1
      //     }
      //     // 处理ios两侧回弹计算错误，用scrollView不会处理无限滚动
      //     if (newPosPage >= 0 && newPosPage < this._childrenSize) {
      //       this._posPage = newPosPage
      //       this._onChange()
      //     }
      //   }

      //   this._isTouchEnd = false
      // }

      onScroll && onScroll(event);
    };

    _this._onMomentumScrollHandle = function (_ref3) {
      var nativeEvent = _ref3.nativeEvent;
      var width = _this.state.width;

      var offsetX = nativeEvent.contentOffset.x;
      _this._posPage = Math.round(offsetX / width);

      _this._onChange();
    };

    _this._setScrollViewRef = function (scrollView) {
      _this.scrollView = scrollView;
    };

    var locked = props.locked,
        infinite = props.infinite,
        vertical = props.vertical,
        useScrollView = props.useScrollView;


    var panResponderValue = panResponderKey.reduce(function (values, key) {
      return _extends(_defineProperty({}, key, props[key]), values);
    }, {});
    if (!locked) {
      panResponderValue = _extends({}, panResponderValue, {
        onPanResponderGrant: _this._onPanResponderGrant,
        onPanResponderMove: _this._onPanResponderMove,
        onPanResponderRelease: _this._onPanResponderRelease
      });
    }

    _this.scrollOnMountCalled = false;
    _this._isScrollView = !vertical && !infinite && useScrollView;
    _this._panResponder = _reactNative.PanResponder.create(panResponderValue);
    _this._AnimatedViewProps = _this._panResponder.panHandlers;
    return _this;
  }

  _createClass(ViewPaged, [{
    key: '_getStyles',
    value: function _getStyles() {
      var vertical = this.props.vertical,
          pos = this.state.pos;

      var key = vertical ? 'top' : 'left';

      return {
        AnimatedStyle: _defineProperty({}, key, pos)
      };
    }
  }, {
    key: '_getDistance',
    value: function _getDistance(gestureState) {
      var vertical = this.props.vertical;

      var suffix = vertical ? 'y' : 'x';
      return gestureState['d' + suffix];
    }

    // _onScrollViewTouchStart = () => {
    //   this._referX = null
    //   this._startDirection = null
    // }

    // _onScrollViewTouchEnd = () => {
    //   this._referX = null
    //   this._isTouchEnd = true
    //   // this._endDirection = null
    // }

  }, {
    key: '_renderContent',
    value: function _renderContent() {
      if (this._isScrollView) {
        var _props = this.props,
            locked = _props.locked,
            scrollViewProps = _props.scrollViewProps;
        var _state = this.state,
            width = _state.width,
            pos = _state.pos;


        return _react2.default.createElement(
          _reactNative.Animated.ScrollView,
          _extends({
            automaticallyAdjustContentInsets: false
            // onScrollBeginDrag={this._onScrollViewTouchStart}
            // onScrollEndDrag={this._onScrollViewTouchEnd}
            , onMomentumScrollBegin: this._onMomentumScrollHandle,
            onMomentumScrollEnd: this._onMomentumScrollHandle,
            scrollEventThrottle: 16,
            scrollsToTop: false,
            showsHorizontalScrollIndicator: false,
            directionalLockEnabled: true,
            alwaysBounceVertical: false
            // keyboardDismissMode='on-drag'
          }, scrollViewProps, {
            horizontal: true,
            pagingEnabled: true,
            contentOffset: { x: this._initialPage * width },
            ref: this._setScrollViewRef,
            scrollEnabled: !locked,
            onScroll: _reactNative.Animated.event([{ nativeEvent: { contentOffset: { x: pos } } }], { useNativeDriver: true, listener: this._onScroll })
          }),
          this._renderPage()
        );
      }

      return null;
    }
  }]);

  return ViewPaged;
}(_react.Component)) || _class;

exports.default = ViewPaged;