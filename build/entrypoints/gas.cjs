"use strict";

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
var _MIMEMessage = require("../MIMEMessage.js");
var _Mailbox = require("../Mailbox.js");
var _MIMETextError = require("../MIMETextError.js");
var _MIMEMessageHeader = require("../MIMEMessageHeader.js");
var _MIMEMessageContent = require("../MIMEMessageContent.js");
var envctx = {
  toBase64: function toBase64(data) {
    return Utilities.base64Encode(data, Utilities.Charset.UTF_8);
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return Utilities.base64EncodeWebSafe(data);
  },
  eol: '\r\n',
  validateContentType: function validateContentType(v) {
    return v.length > 0 ? v : false;
  }
};
function createMimeMessage() {
  return new _MIMEMessage.MIMEMessage(envctx);
}