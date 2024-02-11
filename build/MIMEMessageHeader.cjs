"use strict";

var _sliceInstanceProperty2 = require("@babel/runtime-corejs3/core-js/instance/slice");
var _Array$from = require("@babel/runtime-corejs3/core-js/array/from");
var _Symbol = require("@babel/runtime-corejs3/core-js/symbol");
var _getIteratorMethod = require("@babel/runtime-corejs3/core-js/get-iterator-method");
var _Reflect$construct = require("@babel/runtime-corejs3/core-js/reflect/construct");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MIMEMessageHeader = exports.MIMEMessageContentHeader = void 0;
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/slice"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/filter"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/concat"));
var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/reduce"));
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/find-index"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/map"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/keys"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/includes"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _MIMETextError = require("./MIMETextError.js");
var _Mailbox = require("./Mailbox.js");
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, _isNativeReflectConstruct() ? _Reflect$construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof _Symbol !== "undefined" && _getIteratorMethod(o) || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { var _context10; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty2(_context10 = Object.prototype.toString.call(o)).call(_context10, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/*
    Headers are based on: https://www.rfc-editor.org/rfc/rfc4021#section-2.1
    (Some are ignored as they can be added later or as a custom header.)
*/
var MIMEMessageHeader = exports.MIMEMessageHeader = /*#__PURE__*/function () {
  function MIMEMessageHeader(envctx) {
    var _this = this;
    (0, _classCallCheck2.default)(this, MIMEMessageHeader);
    (0, _defineProperty2.default)(this, "envctx", void 0);
    (0, _defineProperty2.default)(this, "fields", [{
      name: 'Date',
      generator: function generator() {
        return new Date().toUTCString().replace(/GMT|UTC/gi, '+0000');
      }
    }, {
      name: 'From',
      required: true,
      validate: function validate(v) {
        return _this.validateMailboxSingle(v);
      },
      dump: function dump(v) {
        return _this.dumpMailboxSingle(v);
      }
    }, {
      name: 'Sender',
      validate: function validate(v) {
        return _this.validateMailboxSingle(v);
      },
      dump: function dump(v) {
        return _this.dumpMailboxSingle(v);
      }
    }, {
      name: 'Reply-To',
      validate: function validate(v) {
        return _this.validateMailboxSingle(v);
      },
      dump: function dump(v) {
        return _this.dumpMailboxSingle(v);
      }
    }, {
      name: 'To',
      validate: function validate(v) {
        return _this.validateMailboxMulti(v);
      },
      dump: function dump(v) {
        return _this.dumpMailboxMulti(v);
      }
    }, {
      name: 'Cc',
      validate: function validate(v) {
        return _this.validateMailboxMulti(v);
      },
      dump: function dump(v) {
        return _this.dumpMailboxMulti(v);
      }
    }, {
      name: 'Bcc',
      validate: function validate(v) {
        return _this.validateMailboxMulti(v);
      },
      dump: function dump(v) {
        return _this.dumpMailboxMulti(v);
      }
    }, {
      name: 'Message-ID',
      generator: function generator() {
        var _context, _context2;
        var randomstr = (0, _slice.default)(_context = Math.random().toString(36)).call(_context, 2);
        var from = (0, _filter.default)(_context2 = _this.fields).call(_context2, function (obj) {
          return obj.name === 'From';
        })[0].value;
        var domain = from.getAddrDomain();
        return '<' + randomstr + '@' + domain + '>';
      }
    }, {
      name: 'Subject',
      required: true,
      dump: function dump(v) {
        return typeof v === 'string' ? '=?utf-8?B?' + _this.envctx.toBase64(v) + '?=' : '';
      }
    }, {
      name: 'MIME-Version',
      generator: function generator() {
        return '1.0';
      }
    }]);
    this.envctx = envctx;
  }
  (0, _createClass2.default)(MIMEMessageHeader, [{
    key: "dump",
    value: function dump() {
      var lines = '';
      var _iterator = _createForOfIteratorHelper(this.fields),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _context3, _context4;
          var field = _step.value;
          if (field.disabled) continue;
          var isValueDefinedByUser = field.value !== undefined && field.value !== null;
          if (!isValueDefinedByUser && field.required) {
            throw new _MIMETextError.MIMETextError('MIMETEXT_MISSING_HEADER', "The \"".concat(field.name, "\" header is required."));
          }
          if (!isValueDefinedByUser && typeof field.generator !== 'function') continue;
          if (!isValueDefinedByUser && typeof field.generator === 'function') field.value = field.generator();
          var strval = Object.hasOwn(field, 'dump') && typeof field.dump === 'function' ? field.dump(field.value) : typeof field.value === 'string' ? field.value : '';
          lines += (0, _concat.default)(_context3 = (0, _concat.default)(_context4 = "".concat(field.name, ": ")).call(_context4, strval)).call(_context3, this.envctx.eol);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return (0, _slice.default)(lines).call(lines, 0, -1 * this.envctx.eol.length);
    }
  }, {
    key: "toObject",
    value: function toObject() {
      var _context5;
      return (0, _reduce.default)(_context5 = this.fields).call(_context5, function (memo, item) {
        memo[item.name] = item.value;
        return memo;
      }, {});
    }
  }, {
    key: "get",
    value: function get(name) {
      var _context6;
      var fieldMatcher = function fieldMatcher(obj) {
        return obj.name.toLowerCase() === name.toLowerCase();
      };
      var ind = (0, _findIndex.default)(_context6 = this.fields).call(_context6, fieldMatcher);
      return ind !== -1 ? this.fields[ind].value : undefined;
    }
  }, {
    key: "set",
    value: function set(name, value) {
      var fieldMatcher = function fieldMatcher(obj) {
        return obj.name.toLowerCase() === name.toLowerCase();
      };
      var isCustomHeader = !this.fields.some(fieldMatcher);
      if (!isCustomHeader) {
        var _context7;
        var ind = (0, _findIndex.default)(_context7 = this.fields).call(_context7, fieldMatcher);
        var field = this.fields[ind];
        if (field.validate && !field.validate(value)) {
          throw new _MIMETextError.MIMETextError('MIMETEXT_INVALID_HEADER_VALUE', "The value for the header \"".concat(name, "\" is invalid."));
        }
        this.fields[ind].value = value;
        return this.fields[ind];
      }
      return this.setCustom({
        name: name,
        value: value,
        custom: true,
        dump: function dump(v) {
          return typeof v === 'string' ? v : '';
        }
      });
    }
  }, {
    key: "setCustom",
    value: function setCustom(obj) {
      if (this.isHeaderField(obj)) {
        if (typeof obj.value !== 'string') {
          throw new _MIMETextError.MIMETextError('MIMETEXT_INVALID_HEADER_FIELD', 'Custom header must have a value.');
        }
        this.fields.push(obj);
        return obj;
      }
      throw new _MIMETextError.MIMETextError('MIMETEXT_INVALID_HEADER_FIELD', 'Invalid input for custom header. It must be in type of HeaderField.');
    }
  }, {
    key: "validateMailboxSingle",
    value: function validateMailboxSingle(v) {
      return v instanceof _Mailbox.Mailbox;
    }
  }, {
    key: "validateMailboxMulti",
    value: function validateMailboxMulti(v) {
      return v instanceof _Mailbox.Mailbox || this.isArrayOfMailboxes(v);
    }
  }, {
    key: "dumpMailboxMulti",
    value: function dumpMailboxMulti(v) {
      var _this2 = this;
      var dump = function dump(item) {
        var _context8;
        return item.name.length === 0 ? item.dump() : (0, _concat.default)(_context8 = "=?utf-8?B?".concat(_this2.envctx.toBase64(item.name), "?= <")).call(_context8, item.addr, ">");
      };
      return this.isArrayOfMailboxes(v) ? (0, _map.default)(v).call(v, dump).join(",".concat(this.envctx.eol, " ")) : v instanceof _Mailbox.Mailbox ? dump(v) : '';
    }
  }, {
    key: "dumpMailboxSingle",
    value: function dumpMailboxSingle(v) {
      var _this3 = this;
      var dump = function dump(item) {
        var _context9;
        return item.name.length === 0 ? item.dump() : (0, _concat.default)(_context9 = "=?utf-8?B?".concat(_this3.envctx.toBase64(item.name), "?= <")).call(_context9, item.addr, ">");
      };
      return v instanceof _Mailbox.Mailbox ? dump(v) : '';
    }
  }, {
    key: "isHeaderField",
    value: function isHeaderField(v) {
      var validProps = ['name', 'value', 'dump', 'required', 'disabled', 'generator', 'custom'];
      if (this.isObject(v)) {
        var h = v;
        if (Object.hasOwn(h, 'name') && typeof h.name === 'string' && h.name.length > 0) {
          if (!(0, _keys.default)(h).some(function (prop) {
            return !(0, _includes.default)(validProps).call(validProps, prop);
          })) {
            return true;
          }
        }
      }
      return false;
    }
  }, {
    key: "isObject",
    value: function isObject(v) {
      return !!v && v.constructor === Object;
    }
  }, {
    key: "isArrayOfMailboxes",
    value: function isArrayOfMailboxes(v) {
      return this.isArray(v) && v.every(function (item) {
        return item instanceof _Mailbox.Mailbox;
      });
    }
  }, {
    key: "isArray",
    value: function isArray(v) {
      return !!v && v.constructor === Array;
    }
  }]);
  return MIMEMessageHeader;
}();
var MIMEMessageContentHeader = exports.MIMEMessageContentHeader = /*#__PURE__*/function (_MIMEMessageHeader2) {
  (0, _inherits2.default)(MIMEMessageContentHeader, _MIMEMessageHeader2);
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  function MIMEMessageContentHeader(envctx) {
    var _this4;
    (0, _classCallCheck2.default)(this, MIMEMessageContentHeader);
    _this4 = _callSuper(this, MIMEMessageContentHeader, [envctx]);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "fields", [{
      name: 'Content-ID'
    }, {
      name: 'Content-Type'
    }, {
      name: 'Content-Transfer-Encoding'
    }, {
      name: 'Content-Disposition'
    }]);
    return _this4;
  }
  return (0, _createClass2.default)(MIMEMessageContentHeader);
}(MIMEMessageHeader);