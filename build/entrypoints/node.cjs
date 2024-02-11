"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js/weak-map");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptor");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MIMEMessage", {
  enumerable: true,
  get: function get() {
    return _MIMEMessage.MIMEMessage;
  }
});
Object.defineProperty(exports, "MIMEMessageContent", {
  enumerable: true,
  get: function get() {
    return _MIMEMessageContent.MIMEMessageContent;
  }
});
Object.defineProperty(exports, "MIMEMessageHeader", {
  enumerable: true,
  get: function get() {
    return _MIMEMessageHeader.MIMEMessageHeader;
  }
});
Object.defineProperty(exports, "MIMETextError", {
  enumerable: true,
  get: function get() {
    return _MIMETextError.MIMETextError;
  }
});
Object.defineProperty(exports, "Mailbox", {
  enumerable: true,
  get: function get() {
    return _Mailbox.Mailbox;
  }
});
exports.createMimeMessage = createMimeMessage;
var _nodeOs = require("node:os");
var mime = _interopRequireWildcard(require("mime-types"));
var _MIMEMessage = require("../MIMEMessage.js");
var _Mailbox = require("../Mailbox.js");
var _MIMETextError = require("../MIMETextError.js");
var _MIMEMessageHeader = require("../MIMEMessageHeader.js");
var _MIMEMessageContent = require("../MIMEMessageContent.js");
function _getRequireWildcardCache(e) { if ("function" != typeof _WeakMap) return null; var r = new _WeakMap(), t = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && _Object$getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? _Object$getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var envctx = {
  toBase64: function toBase64(data) {
    return Buffer.from(data).toString('base64');
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return Buffer.from(data).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  eol: _nodeOs.EOL,
  validateContentType: function validateContentType(v) {
    return mime.contentType(v);
  }
};
function createMimeMessage() {
  return new _MIMEMessage.MIMEMessage(envctx);
}