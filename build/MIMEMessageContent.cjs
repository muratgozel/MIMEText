"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MIMEMessageContent = void 0;
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/includes"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/map"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/keys"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _MIMEMessageHeader = require("./MIMEMessageHeader.js");
var MIMEMessageContent = exports.MIMEMessageContent = /*#__PURE__*/function () {
  function MIMEMessageContent(envctx, data) {
    var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck2.default)(this, MIMEMessageContent);
    (0, _defineProperty2.default)(this, "envctx", void 0);
    (0, _defineProperty2.default)(this, "headers", void 0);
    (0, _defineProperty2.default)(this, "data", void 0);
    this.envctx = envctx;
    this.headers = new _MIMEMessageHeader.MIMEMessageContentHeader(this.envctx);
    this.data = data;
    this.setHeaders(headers);
  }
  (0, _createClass2.default)(MIMEMessageContent, [{
    key: "dump",
    value: function dump() {
      var eol = this.envctx.eol;
      return this.headers.dump() + eol + eol + this.data;
    }
  }, {
    key: "isAttachment",
    value: function isAttachment() {
      var disposition = this.headers.get('Content-Disposition');
      return typeof disposition === 'string' && (0, _includes.default)(disposition).call(disposition, 'attachment');
    }
  }, {
    key: "isInlineAttachment",
    value: function isInlineAttachment() {
      var disposition = this.headers.get('Content-Disposition');
      return typeof disposition === 'string' && (0, _includes.default)(disposition).call(disposition, 'inline');
    }
  }, {
    key: "setHeader",
    value: function setHeader(name, value) {
      this.headers.set(name, value);
      return name;
    }
  }, {
    key: "getHeader",
    value: function getHeader(name) {
      return this.headers.get(name);
    }
  }, {
    key: "setHeaders",
    value: function setHeaders(obj) {
      var _context,
        _this = this;
      return (0, _map.default)(_context = (0, _keys.default)(obj)).call(_context, function (prop) {
        return _this.setHeader(prop, obj[prop]);
      });
    }
  }, {
    key: "getHeaders",
    value: function getHeaders() {
      return this.headers.toObject();
    }
  }]);
  return MIMEMessageContent;
}();