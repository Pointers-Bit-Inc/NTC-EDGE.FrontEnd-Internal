'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = ViewPageHOC;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var _components = require('./../components');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
// const initialStyle = { flex: 1, display: 'flex', backgroundColor: 'transparent' }
var longSwipesMs = 300;
var flexDirectionMap = {
  top: 'column',
  bottom: 'column-reverse',
  left: 'row',
  right: 'row-reverse'
};

function ViewPageHOC(WrappedComponent) {
  var _class, _class2, _temp, _initialiseProps;

  var ViewPaged = (0, _connect2.default)(_class = (_temp = _class2 = function (_WrappedComponent) {
    _inherits(ViewPaged, _WrappedComponent);

    function ViewPaged(props) {
      _classCallCheck(this, ViewPaged);

      var _this = _possibleConstructorReturn(this, (ViewPaged.__proto__ || Object.getPrototypeOf(ViewPaged)).call(this, props));

      _initialiseProps.call(_this);

      var infinite = props.infinite;

      _this._posPage = _this.getCheckInitialPage();
      if (infinite) {
        _this._posPage += 1;
      }
      // 真正的初始页
      _this._initialPage = _this._posPage;
      var pos = new _components.Animated.Value(0);
      _this._posListener = _this._saveListener(pos);

      _this.state = {
        width: 0,
        height: 0,
        pos: pos,
        isReady: false,
        loadIndex: [_this._initialPage]
      };

      _this._lastPos = 0;
      _this._autoPlayTimer = null;
      _this.currentPage = _this._getCurrnetPage();
      _this._addIndexs = [];
      return _this;
    }

    _createClass(ViewPaged, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (_get(ViewPaged.prototype.__proto__ || Object.getPrototypeOf(ViewPaged.prototype), 'componentDidMount', this)) {
          _get(ViewPaged.prototype.__proto__ || Object.getPrototypeOf(ViewPaged.prototype), 'componentDidMount', this).call(this);
        }
        this.autoPlay();
      }

      // 检验纠正初始页参数

    }, {
      key: 'getCheckInitialPage',
      value: function getCheckInitialPage() {
        var initialPage = this.props.initialPage;

        if (initialPage < 0) {
          initialPage = 0;
        } else if (initialPage >= this._childrenSize) {
          initialPage = this._childrenSize - 1;
        }

        return initialPage;
      }
    }, {
      key: 'autoPlay',
      value: function autoPlay() {
        var _this2 = this;

        var _props = this.props,
            autoPlay = _props.autoPlay,
            autoPlaySpeed = _props.autoPlaySpeed;

        if (autoPlay) {
          this._clearAutoPlayTimer();
          // 排除第0页时重置操作，否则更新pos至下次连续切换
          if (this._posPage && this._resetLastPos()) {
            this._updateAnimatedValue(this._lastPos);
          }

          this._autoPlayTimer = setTimeout(function () {
            var nextPosPage = _this2._getNextPosPage();
            _this2._goToPage(nextPosPage);
            // this.autoPlay()
          }, autoPlaySpeed);
        }
      }

      // 计算下一索引，针对无限滚动

    }, {
      key: '_getNextPosPage',
      value: function _getNextPosPage() {
        var infinite = this.props.infinite;

        var nextPosPage = this._posPage + 1;
        if (nextPosPage > this.childrenSize - 1) {
          return infinite ? 2 : 0;
        }

        return nextPosPage;
      }
    }, {
      key: '_getCurrnetPage',
      value: function _getCurrnetPage() {
        return this._getCurrentPageForPosPage(this._posPage);
      }
    }, {
      key: '_getCurrentPageForPosPage',
      value: function _getCurrentPageForPosPage(posPage) {
        var infinite = this.props.infinite;

        if (infinite) {
          switch (posPage) {
            case 0:
              return this.childrenSize - 3;
            case this.childrenSize - 1:
              return 0;
            default:
              return posPage - 1;
          }
        }
        return posPage;
      }
    }, {
      key: '_getPosPageForCurrentPage',
      value: function _getPosPageForCurrentPage(page) {
        var infinite = this.props.infinite;

        if (infinite) {
          return page + 1;
        }
        return page;
      }

      // 计算重制跳转页

    }, {
      key: '_getResetPage',
      value: function _getResetPage() {
        var _posPage = this._posPage;
        var infinite = this.props.infinite;

        if (infinite) {
          if (_posPage === 0) {
            return this._childrenSize;
          } else if (_posPage === this._childrenSize + 1) {
            // return _posPage - this._childrenSize
            return 1;
          }
        }
        return _posPage;
      }

      // 无限滚动重置滚动位置

    }, {
      key: '_resetLastPos',
      value: function _resetLastPos() {
        var _posPage = this._posPage;

        var page = this._getResetPage();
        if (page !== _posPage) {
          this._lastPos = this._getPosForPage(page);
          return true;
        }
        return false;
      }

      // 判断未无限滚动时是否到头不可拖动

    }, {
      key: '_TouchStartEvent',
      value: function _TouchStartEvent() {
        if (!this.state.isReady) return;

        this._touchSartTime = Date.now();

        this._clearAutoPlayTimer();
      }
    }, {
      key: '_TouchMoveEvent',
      value: function _TouchMoveEvent(TouchState) {
        if (!this.state.isReady) return;
        var isMovingRender = this.props.isMovingRender;


        this._resetLastPos();
        var distance = this._getDistance(TouchState);
        var nextValue = this._lastPos + distance;
        if (isMovingRender) {
          // 预加载页数
          var posPage = this._getPageForPos(distance, nextValue);
          this._onChange(posPage, true, false);
        }

        this._updateAnimatedValue(nextValue);
      }
    }, {
      key: '_TouchEndEvent',
      value: function _TouchEndEvent(TouchState) {
        this._addIndexs = [];
        if (!this.state.isReady) return;

        var distance = this._getDistance(TouchState);
        var _boxSize = this._boxSize,
            _touchSartTime = this._touchSartTime;

        var judgeSize = _boxSize / 3;
        var touchEndTime = Date.now();

        // 检测边界拖动
        if (this._isMoveBorder(distance)) {
          var diffTime = touchEndTime - _touchSartTime;
          // 满足移动跳转下一页条件
          if ((diffTime <= longSwipesMs || Math.abs(distance) >= judgeSize) && distance !== 0) {
            this._lastPos += distance;
          }

          // 重置或跳转下一页
          var posPage = this._getPageForPos(distance);
          this._goToPage(posPage, true);
        }

        // this.autoPlay()
      }

      // 对外提供跳转页数，检验页数正确性

    }, {
      key: '_goToPage',


      // 对内提供跳转页数，传入定位的页数
      value: function _goToPage(posPage, hasAnimation) {
        if (!this.state.isReady) return;

        this._posPage = posPage;
        // 使用传入的下一页值，非计算的下一页值，无限滚动懒加载用
        this._lastPos = this._getPosForPage(this._posPage);
        // 处理切换动画
        this._updateAnimatedQueue(hasAnimation);
        var nextPage = this._getCurrnetPage();
        // 没有跳转页仅仅重置动画return处理，只有1页的除外，让1页也可以无限循环
        if (this._childrenSize > 1 && +nextPage === +this.currentPage) return;

        this._onChange();
      }
    }, {
      key: '_onChange',
      value: function _onChange() {
        var _posPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._posPage;

        var _this3 = this;

        var isDiff = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var isOnChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var oldLoadIndex = this.state.loadIndex;

        var loadIndex = oldLoadIndex.slice();

        this._prevPage = this.currentPage;
        this.currentPage = this._getCurrnetPage();
        if (loadIndex.indexOf(_posPage) === -1) {
          loadIndex.push(_posPage);
          this._addIndexs.push(_posPage);
          // 加载未重置的页
          var page = this._getResetPage();
          if (page !== this._posPage) {
            loadIndex.push(page);
            this._addIndexs.push(page);
          }
        }

        var onChange = this.props.onChange;
        // 减少空render次数

        if (!isDiff || (0, _utils.size)(loadIndex) !== (0, _utils.size)(oldLoadIndex)) {
          this.setState({ loadIndex: loadIndex }, function () {
            if (isOnChange) {
              onChange(_this3.currentPage, _this3._prevPage);
            }
          });
        } else {
          if (isOnChange) {
            onChange(this.currentPage, this._prevPage);
          }
          this._addIndexs = [];
        }
      }

      // move时设置动画值

    }, {
      key: '_updateAnimatedValue',
      value: function _updateAnimatedValue(nextValue) {
        var infinite = this.props.infinite;

        if (!infinite) {
          // 回弹限制
          if (nextValue <= 0 && nextValue >= this._getMaxPos()) {
            this.state.pos.setValue(nextValue);
          }
        } else {
          this.state.pos.setValue(nextValue);
        }
      }
    }, {
      key: '_updateAnimatedQueue',
      value: function _updateAnimatedQueue() {
        var _this4 = this;

        var hasAnimation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.hasAnimation;
        var duration = this.props.duration;
        var pos = this.state.pos;

        var animations = [];
        var toValue = this._lastPos;

        if (hasAnimation) {
          animations.push(_components.Animated.timing(pos, {
            toValue: toValue,
            duration: duration,
            easing: _components.Easing.out(_components.Easing.ease) // default
          }));
          this._clearAutoPlayTimer();
          _components.Animated.parallel(animations).start(function () {
            // 所有类型的动画结束后都启用下次的自动播放，其他地方只用关心何时关闭循环
            _this4.autoPlay();
          });
        } else {
          this.state.pos.setValue(toValue);
        }
      }
    }, {
      key: '_getPosForPage',
      value: function _getPosForPage(page) {
        return -page * this._boxSize;
      }
    }, {
      key: '_getPageForPos',
      value: function _getPageForPos(distance) {
        var _lastPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._lastPos;

        var pageDecimal = Math.abs(_lastPos / this._boxSize);
        var page = void 0;

        if (distance < 0) {
          page = Math.ceil(pageDecimal);
        } else {
          page = Math.floor(pageDecimal);
        }

        if (page < 0) {
          page = 0;
        } else if (page > this.childrenSize - 1) {
          page = this.childrenSize - 1;
        }

        return page;
      }

      // 无限轮播拼接children

    }, {
      key: '_clearAutoPlayTimer',
      value: function _clearAutoPlayTimer() {
        clearTimeout(this._autoPlayTimer);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._clearAutoPlayTimer();
      }
    }, {
      key: '_checkRenderComponent',
      value: function _checkRenderComponent(key) {
        var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var Component = this.props[key];
        if (Component) {
          var element = Component(props) || null;
          // 使用cloneElement防止重复创建组件
          return element && _react2.default.cloneElement(element, { key: key });
          // return (
          //   <Component key={key} {...props}/>
          // )
        }
        return null;
      }
    }, {
      key: '_renderPropsComponent',
      value: function _renderPropsComponent(key) {
        var _state = this.state,
            width = _state.width,
            height = _state.height,
            pos = _state.pos;
        var vertical = this.props.vertical;


        return this._checkRenderComponent(key, {
          activeTab: this.currentPage,
          goToPage: this.goToPage,
          vertical: vertical,
          width: width,
          height: height,
          pos: pos
        });
      }
    }, {
      key: '_saveListener',
      value: function _saveListener(animatedValue) {
        var _this5 = this;

        var listeners = new Set();
        var addListener = animatedValue.addListener;

        animatedValue.addListener = function (listener) {
          var wrapListener = listener;
          if (!_this5._isScrollView) {
            wrapListener = function wrapListener(params) {
              // 模拟scrollView取反给正向值
              var value = -params.value;
              listener({ value: value });
            };
          }
          listeners.add(wrapListener);
          addListener.call(animatedValue, wrapListener);
        };

        return listeners;
      }
    }, {
      key: '_restoreListener',
      value: function _restoreListener(animatedValue, listeners) {
        listeners.forEach(function (listener) {
          animatedValue.addListener(listener);
        });
      }
    }, {
      key: '_getMaxPos',
      value: function _getMaxPos() {
        return -(this.childrenSize - 1) * this._boxSize;
      }
    }, {
      key: '_runMeasurements',
      value: function _runMeasurements(width, height) {
        var vertical = this.props.vertical;


        this._boxSize = vertical ? height : width;
        // this._maxPos = -(this.childrenSize - 1) * this._boxSize
        this._lastPos = this._getPosForPage(this._posPage);
        var pos = new _components.Animated.Value(this._lastPos);
        // 恢复pos监听的回掉
        this._restoreListener(pos, this._posListener);

        var initialState = {
          isReady: true,
          width: width,
          height: height,
          pos: pos
        };

        this.setState(initialState);
        return initialState;
      }
    }, {
      key: '_getStyles',
      value: function _getStyles(isClearCache) {
        if (isClearCache) this.Styles = null;
        if (this.Styles) return this.Styles;

        var _props2 = this.props,
            vertical = _props2.vertical,
            renderPosition = _props2.renderPosition,
            style = _props2.style,
            _state2 = this.state,
            isReady = _state2.isReady,
            width = _state2.width,
            height = _state2.height,
            _boxSize = this._boxSize;

        var flexDirection = flexDirectionMap[renderPosition] || flexDirectionMap.top;
        var commonStyle = {
          containerStyle: {
            flexDirection: flexDirection
          }
        };

        if (vertical) {
          commonStyle = _extends({}, commonStyle, {
            wrapStyle: { flexDirection: 'column' },
            AnimatedStyle: { flexDirection: 'column' },
            pageStyle: { height: _boxSize, width: width }
          });
        } else {
          commonStyle = _extends({}, commonStyle, {
            wrapStyle: { flexDirection: 'row' },
            AnimatedStyle: { flexDirection: 'row' },
            pageStyle: { width: _boxSize, height: height }
          });
        }

        var mergeStyles = (0, _utils.getMergeObject)(commonStyle, _get(ViewPaged.prototype.__proto__ || Object.getPrototypeOf(ViewPaged.prototype), '_getStyles', this).call(this));
        var Styles = (0, _utils.getMergeObject)(_components.Style, mergeStyles);

        if (isReady) {
          Styles.containerStyle = (0, _utils.mergeStyle)(style, Styles.containerStyle);
        } else {
          // 不需要设置initialStyle，在android上会造成setState后不展示子视图的问题
          // Style.wrapStyle = initialStyle
          // Style.AnimatedStyle = initialStyle
          Styles.pageStyle = {
            flex: 1,
            display: 'flex',
            overflow: 'hidden'
          };
        }

        this.Styles = Styles;

        return this.Styles;
      }
    }, {
      key: '_shouldRenderPage',
      value: function _shouldRenderPage(index) {
        var preRenderRange = this.props.preRenderRange;

        var hasRange = index < this._posPage + preRenderRange + 1 && index > this._posPage - preRenderRange - 1;
        var hasIndex = this._addIndexs.includes(index);
        var isUpdate = hasRange || hasIndex;

        return isUpdate;
      }
    }, {
      key: '_renderPage',
      value: function _renderPage() {
        var _this6 = this;

        var _state3 = this.state,
            isReady = _state3.isReady,
            loadIndex = _state3.loadIndex;

        var _getStyles2 = this._getStyles(),
            pageStyle = _getStyles2.pageStyle;

        return this.childrenList.map(function (page, index) {
          var isRender = loadIndex.includes(index);

          return _react2.default.createElement(
            _components.SceneComponent,
            {
              key: index,
              shouldUpdated: _this6._shouldRenderPage(index),
              style: !isReady ? isRender ? pageStyle : {} : pageStyle
            },
            isRender ? page : null
          );
        });
      }
    }, {
      key: '_renderContent',
      value: function _renderContent() {
        var superRender = null;
        if (_get(ViewPaged.prototype.__proto__ || Object.getPrototypeOf(ViewPaged.prototype), '_renderContent', this)) {
          superRender = _get(ViewPaged.prototype.__proto__ || Object.getPrototypeOf(ViewPaged.prototype), '_renderContent', this).call(this);
          if (superRender) return superRender;
        }

        var _getStyles3 = this._getStyles(),
            AnimatedStyle = _getStyles3.AnimatedStyle;

        return _react2.default.createElement(
          _components.AnimatedView,
          _extends({
            style: AnimatedStyle
          }, this._AnimatedViewProps),
          this._renderPage()
        );
      }
    }, {
      key: 'render',
      value: function render() {
        var infinite = this.props.infinite;
        var isReady = this.state.isReady;


        if (infinite) {
          this.childrenList = this.getInfiniteChildren();
          this.childrenSize = (0, _utils.size)(this.childrenList);
        }

        var _getStyles4 = this._getStyles(true),
            containerStyle = _getStyles4.containerStyle,
            wrapStyle = _getStyles4.wrapStyle;

        return _react2.default.createElement(
          _components.View,
          { style: containerStyle },
          this._renderPropsComponent('renderHeader'),
          _react2.default.createElement(
            _components.View,
            { style: wrapStyle, onLayout: !isReady ? this._onLayout : null },
            this._renderContent()
          ),
          this._renderPropsComponent('renderFooter')
        );
      }
    }]);

    return ViewPaged;
  }(WrappedComponent), _initialiseProps = function _initialiseProps() {
    var _this7 = this;

    this._isMoveBorder = function (distance) {
      var _props3 = _this7.props,
          locked = _props3.locked,
          infinite = _props3.infinite;

      if (locked) return false;
      if (infinite) return infinite;

      if (distance > 0 && _this7.currentPage !== 0) return true;
      if (distance < 0 && _this7.currentPage + 1 !== _this7.childrenSize) return true;

      return false;
    };

    this.goToPage = function (page) {
      if (page < 0 || page > _this7._childrenSize - 1) {
        return;
      }

      _this7._clearAutoPlayTimer();
      var posPage = _this7._getPosPageForCurrentPage(page);
      // RN scrollView走自己的处理方法
      if (_this7._isScrollView) {
        _this7._scrollToPage(posPage);
      } else {
        _this7._goToPage(posPage);
      }
    };

    this.getInfiniteChildren = function () {
      var head = (0, _utils.findLast)(_this7.childrenList, function (child) {
        return !!child;
      });
      var foot = (0, _utils.find)(_this7.childrenList, function (child) {
        return !!child;
      });

      return [_react2.default.cloneElement(head, { key: 'page-head' })].concat(_toConsumableArray(_this7.childrenList), [_react2.default.cloneElement(foot, { key: 'page-foot' })]);
    };
  }, _temp)) || _class;

  return ViewPaged;
}