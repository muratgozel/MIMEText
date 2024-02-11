"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mailbox = void 0;
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/includes"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/concat"));
var _trim = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/trim"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/slice"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _MIMETextError = require("./MIMETextError.js");
var Mailbox = exports.Mailbox = /*#__PURE__*/function () {
  function Mailbox(input) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      type: 'To'
    };
    (0, _classCallCheck2.default)(this, Mailbox);
    (0, _defineProperty2.default)(this, "reSpecCompliantAddr", /(([^<>\r\n]+)\s)?<[^\r\n]+>/);
    (0, _defineProperty2.default)(this, "name", '');
    (0, _defineProperty2.default)(this, "addr", '');
    (0, _defineProperty2.default)(this, "type", 'To');
    this.type = config.type;
    this.parse(input);
  }
  (0, _createClass2.default)(Mailbox, [{
    key: "getAddrDomain",
    value: function getAddrDomain() {
      var _context;
      if ((0, _includes.default)(_context = this.addr).call(_context, '@')) {
        var arr = this.addr.split('@');
        if (arr.length > 1) return arr[1];
      }
      return '';
    }
  }, {
    key: "dump",
    value: function dump() {
      var _context2;
      return this.name.length > 0 ? (0, _concat.default)(_context2 = "\"".concat(this.name, "\" <")).call(_context2, this.addr, ">") : "<".concat(this.addr, ">");
    }
  }, {
    key: "parse",
    value: function parse(input) {
      if (this.isMailboxAddrObject(input)) {
        this.addr = input.addr;
        if (typeof input.name === 'string') this.name = input.name;
        if (typeof input.type === 'string') this.type = input.type;
        return this;
      }
      if (this.isMailboxAddrText(input)) {
        var _context3, _context4, _context5;
        var text = (0, _trim.default)(input).call(input);
        if ((0, _slice.default)(text).call(text, 0, 1) === '<' && (0, _slice.default)(text).call(text, -1) === '>') {
          this.addr = (0, _slice.default)(text).call(text, 1, -1);
          return this;
        }
        var arr = text.split(' <');
        arr[0] = /^("|')/.test(arr[0]) ? (0, _slice.default)(_context3 = arr[0]).call(_context3, 1) : arr[0];
        arr[0] = /("|')$/.test(arr[0]) ? (0, _slice.default)(_context4 = arr[0]).call(_context4, 0, -1) : arr[0];
        arr[1] = (0, _slice.default)(_context5 = arr[1]).call(_context5, 0, -1);
        this.name = arr[0];
        this.addr = arr[1];
        return this;
      }
      if (typeof input === 'string') {
        this.addr = input;
        return this;
      }
      throw new _MIMETextError.MIMETextError('MIMETEXT_INVALID_MAILBOX', 'Couldn\'t recognize the input.');
    }
  }, {
    key: "isMailboxAddrText",
    value: function isMailboxAddrText(v) {
      return typeof v === 'string' && this.reSpecCompliantAddr.test(v);
    }
  }, {
    key: "isMailboxAddrObject",
    value: function isMailboxAddrObject(v) {
      return this.isObject(v) && Object.hasOwn(v, 'addr');
    }
  }, {
    key: "isObject",
    value: function isObject(v) {
      return !!v && v.constructor === Object;
    }
  }]);
  return Mailbox;
}();