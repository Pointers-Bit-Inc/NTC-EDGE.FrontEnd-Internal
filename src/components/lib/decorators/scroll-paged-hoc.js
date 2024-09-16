'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = ScrollPageHOC;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../utils');

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var _viewPaged = require('../view-paged');

var _viewPaged2 = _interopRequireDefault(_viewPaged);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function ScrollPageHOC(WrappedComponent) {
  var _class, _class2, _temp;

  var ScrollPaged = (0, _connect2.default)(_class = (_temp = _class2 = function (_WrappedComponent) {
    _inherits(ScrollPaged, _WrappedComponent);

    function ScrollPaged(props) {
      _classCallCheck(this, ScrollPaged);

      var _this = _possibleConstructorReturn(this, (ScrollPaged.__proto__ || Object.getPrototypeOf(ScrollPaged)).call(this, props));

      _this.onChange = function (index, oldIndex) {
        var onChange = _this.props.onChange;
        // 肯定处于边界位置,多此一举设置

        _this.isBorder = true;
        // 判断只有下次move事件后才能触发end事件
        _this.isTouchMove = false;
        // 描述下一页的边界方向
        _this.borderDirection = index > oldIndex ? 'isStart' : 'isEnd';

        // 这一步设置false很重要，可以避免页间快速切换造成的scrollView位置错移
        // 通过打印手势和scrollView的事件触发的先后顺序，发现这和设置此值无关
        // 但如果此值为true在下次Touchstart中会被设置为false，之后move中如果是翻页又会被设置为true
        // 造成scrollView的滚动状态切换了3次，如果此值为false，scrollView的滚动状态只会切换一次，推测可能是这里出了问题
        // 是否能作手势操作应完全交给scrollView的Touchmove事件去处理
        var flag = _this.hasScrollViewPages.includes(+index);
        _this.setResponder(!flag);

        onChange(index, oldIndex);
      };

      _this.setViewPagedRef = function (ref) {
        if (ref) {
          _this.viewPagedRef = ref;
        }
      };

      _this._setScrollViewRef = function (ref) {
        if (ref) {
          // 初次渲染重置状态并保存页数
          _this.setResponder(false);
          if (_this.viewPagedRef) {
            var currentPage = _this.viewPagedRef.currentPage;

            _this.hasScrollViewPages.push(+currentPage);
          }
        }
      };

      _this.isBorder = true;
      _this.borderDirection = 'isStart';
      // 默认为true，为了处理没有使用context的滚动组件child
      _this.isResponder = true;
      _this.isTouchMove = false;
      _this.hasScrollViewPages = [];
      return _this;
    }

    _createClass(ScrollPaged, [{
      key: 'setResponder',
      value: function setResponder(flag) {
        // RN android需要单独处理
        if (_get(ScrollPaged.prototype.__proto__ || Object.getPrototypeOf(ScrollPaged.prototype), 'setResponder', this)) {
          _get(ScrollPaged.prototype.__proto__ || Object.getPrototypeOf(ScrollPaged.prototype), 'setResponder', this).call(this, flag);
        }
        this.isResponder = flag;
      }
    }, {
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          ScrollView: this.ScrollViewMonitor
        };
      }
    }, {
      key: 'getViewPagedInstance',
      value: function getViewPagedInstance() {
        var withRef = this.props.withRef;

        if (!withRef) {
          console.warn('To access the viewPage instance, you need to specify withRef=true in the props');
        }
        return this.viewPagedRef;
      }
    }, {
      key: 'setBorderValue',
      value: function setBorderValue(startValue, endValue, maxValue) {
        var isStart = parseFloat(startValue) <= 0;
        var isEnd = parseFloat((0, _utils.accAdd)(startValue, endValue).toFixed(2)) >= parseFloat(maxValue.toFixed(2));
        this.borderDirection = isStart ? 'isStart' : isEnd ? 'isEnd' : false;
        this.isBorder = this.triggerJudge(isStart, isEnd);
      }
    }, {
      key: 'triggerJudge',
      value: function triggerJudge(isStart, isEnd) {
        var infinite = this.props.infinite;

        var expression = this.viewPagedRef.currentPage;
        if (infinite) expression = false;

        switch (expression) {
          case 0:
            return isEnd && this.borderDirection === 'isEnd';
          case this.childrenSize - 1:
            return isStart && this.borderDirection === 'isStart';
          default:
            return isStart && this.borderDirection === 'isStart' || isEnd && this.borderDirection === 'isEnd';
        }
      }
    }, {
      key: 'checkMove',
      value: function checkMove(x, y) {
        var startY = this.startY,
            startX = this.startX,
            vertical = this.props.vertical;

        var yValue = y - startY;
        var xValue = x - startX;
        if (vertical) {
          return Math.abs(yValue) > Math.abs(xValue);
        }
        return Math.abs(xValue) > Math.abs(yValue);
      }
    }, {
      key: 'checkScrollContent',
      value: function checkScrollContent(sizeValue, layoutValue) {
        return parseFloat(sizeValue.toFixed(2)) > parseFloat(layoutValue.toFixed(2));
      }
    }, {
      key: '_TouchStartEvent',
      value: function _TouchStartEvent(x, y) {
        this.startX = x;
        this.startY = y;
        this.setResponder(false);
      }
    }, {
      key: '_TouchMoveEvent',
      value: function _TouchMoveEvent(x, y, sizeValue, layoutValue) {
        if (!this.isTouchMove) this.isTouchMove = true;

        if (this.checkMove(x, y)) {
          var startY = this.startY,
              startX = this.startX,
              vertical = this.props.vertical;

          var hasScrollContent = this.checkScrollContent(sizeValue, layoutValue);

          if (hasScrollContent) {
            if (this.isBorder) {
              var distance = vertical ? y - startY : x - startX;
              // 大于1.6为了防抖
              if (distance !== 0 && Math.abs(distance) > 1.6) {
                var direction = distance > 0; // 向上

                if (this.triggerJudge(direction, !direction)) {
                  this.setResponder(true);
                } else {
                  this.isBorder = false;
                  this.borderDirection = false;
                  this.setResponder(false);
                }
              }
            }
          } else {
            this.setResponder(true);
          }
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(
          _viewPaged2.default,
          _extends({}, this.props, this._viewPagedProps, {
            ref: this.setViewPagedRef
            // 避免在无限时滚动切换等其他问题，禁用这两个props，如实在有需要可继承此组件重写render方法
            , infinite: false,
            autoPlay: false,
            onChange: this.onChange
          }),
          this.childrenList
        );
      }
    }]);

    return ScrollPaged;
  }(WrappedComponent), _class2.childContextTypes = {
    ScrollView: _propTypes2.default.func
  }, _temp)) || _class;

  // const { defaultProps } = ScrollPaged
  // // 重置默认参数
  // ScrollPaged.defaultProps = {
  //   ...defaultProps,
  //   vertical: true,
  // }

  return ScrollPaged;
}