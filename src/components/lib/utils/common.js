'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var noop = exports.noop = function noop() {};

var getType = exports.getType = function getType(object) {
  return Object.prototype.toString.call(object).slice(8, -1);
};

var isEmpty = exports.isEmpty = function isEmpty(value) {
  var type = getType(value);

  switch (type) {
    case 'Array':
      return !value.length;
    case 'Object':
      return !Object.keys(value).length;
    default:
      return !value;
  }
};

var baseGetSet = function baseGetSet(path) {
  var type = getType(path);
  switch (type) {
    case 'Array':
      return path;
    case 'String':
    case 'Number':
      return ('' + path).split('.');
    default:
      return [];
  }
};

var get = exports.get = function get(object, path, defaultValue) {
  var pathArray = baseGetSet(path);

  return pathArray.reduce(function (obj, key) {
    return obj && obj[key] ? obj[key] : null;
  }, object) || defaultValue;
};

var set = exports.set = function set(object, path, value) {
  var pathArray = baseGetSet(path);
  var len = pathArray.length;

  return pathArray.reduce(function (obj, key, ind) {
    if (obj && ind === len - 1) {
      obj[key] = value;
    }

    return obj ? obj[key] : null;
  }, object);
};

var keys = function keys(value) {
  var type = getType(value);

  switch (type) {
    case 'Array':
    case 'Object':
      return Object.keys(value);
    default:
      return [];
  }
};

var size = exports.size = function size(value) {
  if (value) {
    var type = getType(value);
    switch (type) {
      case 'Array':
        return value.length;
      case 'Object':
        return keys(value).length;
      default:
        return value.length || 0;
    }
  }
  return 0;
};

var getFind = function getFind(value, handle) {
  var len = size(value);
  for (var i = 0; i < len; i++) {
    var item = value[i];
    if (handle(item, i, value)) return item;
  }
  return undefined;
};

var find = exports.find = function find(value, handle) {
  if (value) {
    var type = getType(value);
    switch (type) {
      case 'Array':
        return value.find ? value.find(handle) : getFind(value, handle);
      default:
        return undefined;
    }
  }
  return undefined;
};

var findLast = exports.findLast = function findLast(value, handle) {
  var arr = value && value.reverse && value.slice().reverse();
  return find(arr, handle);
};

var mergeWith = exports.mergeWith = function mergeWith(originObject, mergeObject, handle) {
  var originKeys = keys(originObject);
  var mergeKeys = keys(mergeObject);
  var reObject = {};
  originKeys.forEach(function (key) {
    var mergeIndex = mergeKeys.indexOf(key);
    if (mergeIndex > -1) {
      reObject[key] = handle(originObject[key], mergeObject[key], key, originObject, mergeObject);
      mergeKeys.splice(mergeIndex, 1);
    } else {
      reObject[key] = originObject[key];
    }
  });
  mergeKeys.forEach(function (key) {
    reObject[key] = mergeObject[key];
  });

  return reObject;
};

var mergeStyle = exports.mergeStyle = function mergeStyle() {
  for (var _len = arguments.length, styles = Array(_len), _key = 0; _key < _len; _key++) {
    styles[_key] = arguments[_key];
  }

  return styles.reduce(function (p, c) {
    return _extends({}, p || {}, c || {});
  }, {});
};

var getMergeObject = exports.getMergeObject = function getMergeObject(originObject, mergeObject) {
  return mergeWith(originObject, mergeObject, function (originValue, mergeValue) {
    var type = getType(originValue);

    switch (type) {
      case 'Array':
        return [].concat(_toConsumableArray(originValue), _toConsumableArray(mergeValue));
      case 'Function':
        return function () {
          originValue.apply(undefined, arguments);mergeValue.apply(undefined, arguments);
        };
      case 'Object':
        return _extends({}, originValue, mergeValue);
      default:
        return mergeValue;
    }
  });
};

var getDisplayName = exports.getDisplayName = function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
};

var getPrototypeOf = exports.getPrototypeOf = function getPrototypeOf(object) {
  return Object.getPrototypeOf ? Object.getPrototypeOf(object) : object.__proto__;
};

var copyStatic = exports.copyStatic = function copyStatic(target, source, options) {
  var _ref = options || {},
      _ref$finallyInherit = _ref.finallyInherit,
      finallyInherit = _ref$finallyInherit === undefined ? Object : _ref$finallyInherit,
      _ref$exclude = _ref.exclude,
      exclude = _ref$exclude === undefined ? [] : _ref$exclude;

  var inherited = getPrototypeOf(source);

  if (inherited && inherited !== getPrototypeOf(finallyInherit)) {
    copyStatic(target, inherited, options);
  }

  var propertys = Object.keys(source);
  propertys.forEach(function (key) {
    if (exclude.indexOf(key) !== -1) {
      target[key] = source[key];
    }
  });

  return target;
};

var accAdd = exports.accAdd = function accAdd(arg1, arg2) {
  var r1 = void 0;
  var r2 = void 0;
  var m = void 0;
  var c = void 0;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);

  // eslint-disable-next-line no-restricted-properties
  m = Math.pow(10, Math.max(r1, r2));
  // m = 10 ** Math.max(r1, r2)

  if (c > 0) {
    // eslint-disable-next-line no-restricted-properties
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', '')) * cm;
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm;
      arg2 = Number(arg2.toString().replace('.', ''));
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''));
    arg2 = Number(arg2.toString().replace('.', ''));
  }
  return (arg1 + arg2) / m;
};