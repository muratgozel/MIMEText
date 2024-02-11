"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MIMEMessage = void 0;
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/slice"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/includes"));
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/assign"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/concat"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/keys"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _MIMETextError = require("./MIMETextError.js");
var _MIMEMessageHeader = require("./MIMEMessageHeader.js");
var _Mailbox = require("./Mailbox.js");
var _MIMEMessageContent = require("./MIMEMessageContent.js");
var MIMEMessage = exports.MIMEMessage = /*#__PURE__*/function () {
  function MIMEMessage(envctx) {
    (0, _classCallCheck2.default)(this, MIMEMessage);
    (0, _defineProperty2.default)(this, "envctx", void 0);
    (0, _defineProperty2.default)(this, "headers", void 0);
    (0, _defineProperty2.default)(this, "boundaries", {
      mixed: '',
      alt: '',
      related: ''
    });
    (0, _defineProperty2.default)(this, "validTypes", ['text/html', 'text/plain']);
    (0, _defineProperty2.default)(this, "validContentTransferEncodings", ['7bit', '8bit', 'binary', 'quoted-printable', 'base64']);
    (0, _defineProperty2.default)(this, "messages", []);
    this.envctx = envctx;
    this.headers = new _MIMEMessageHeader.MIMEMessageHeader(this.envctx);
    this.messages = [];
    this.generateBoundaries();
  }
  (0, _createClass2.default)(MIMEMessage, [{
    key: "asRaw",
    value: function asRaw() {
      var _this = this;
      var eol = this.envctx.eol;
      var lines = this.headers.dump();
      var plaintext = this.getMessageByType('text/plain');
      var html = this.getMessageByType('text/html');
      var primaryMessage = html !== null && html !== void 0 ? html : plaintext !== null && plaintext !== void 0 ? plaintext : undefined;
      if (primaryMessage === undefined) {
        throw new _MIMETextError.MIMETextError('MIMETEXT_MISSING_BODY', 'No content added to the message.');
      }
      var hasAttachments = this.hasAttachments();
      var hasInlineAttachments = this.hasInlineAttachments();
      var structure = hasInlineAttachments && hasAttachments ? 'mixed+related' : hasAttachments ? 'mixed' : hasInlineAttachments ? 'related' : plaintext && html ? 'alternative' : '';
      if (structure === 'mixed+related') {
        var _context, _context2, _context3, _context4;
        var attachments = (0, _slice.default)(_context = (0, _map.default)(_context2 = this.getAttachments()).call(_context2, function (a) {
          return '--' + _this.boundaries.mixed + eol + a.dump() + eol + eol;
        }).join('')).call(_context, 0, -1 * eol.length);
        var inlineAttachments = (0, _slice.default)(_context3 = (0, _map.default)(_context4 = this.getInlineAttachments()).call(_context4, function (a) {
          return '--' + _this.boundaries.related + eol + a.dump() + eol + eol;
        }).join('')).call(_context3, 0, -1 * eol.length);
        return lines + eol + 'Content-Type: multipart/mixed; boundary=' + this.boundaries.mixed + eol + eol + '--' + this.boundaries.mixed + eol + 'Content-Type: multipart/related; boundary=' + this.boundaries.related + eol + eol + this.dumpTextContent(plaintext, html, this.boundaries.related) + eol + eol + inlineAttachments + '--' + this.boundaries.related + '--' + eol + attachments + '--' + this.boundaries.mixed + '--';
      } else if (structure === 'mixed') {
        var _context5, _context6;
        var _attachments = (0, _slice.default)(_context5 = (0, _map.default)(_context6 = this.getAttachments()).call(_context6, function (a) {
          return '--' + _this.boundaries.mixed + eol + a.dump() + eol + eol;
        }).join('')).call(_context5, 0, -1 * eol.length);
        return lines + eol + 'Content-Type: multipart/mixed; boundary=' + this.boundaries.mixed + eol + eol + this.dumpTextContent(plaintext, html, this.boundaries.mixed) + eol + (plaintext && html ? '' : eol) + _attachments + '--' + this.boundaries.mixed + '--';
      } else if (structure === 'related') {
        var _context7, _context8;
        var _inlineAttachments = (0, _slice.default)(_context7 = (0, _map.default)(_context8 = this.getInlineAttachments()).call(_context8, function (a) {
          return '--' + _this.boundaries.related + eol + a.dump() + eol + eol;
        }).join('')).call(_context7, 0, -1 * eol.length);
        return lines + eol + 'Content-Type: multipart/related; boundary=' + this.boundaries.related + eol + eol + this.dumpTextContent(plaintext, html, this.boundaries.related) + eol + eol + _inlineAttachments + '--' + this.boundaries.related + '--';
      } else if (structure === 'alternative') {
        return lines + eol + 'Content-Type: multipart/alternative; boundary=' + this.boundaries.alt + eol + eol + this.dumpTextContent(plaintext, html, this.boundaries.alt) + eol + eol + '--' + this.boundaries.alt + '--';
      } else {
        return lines + eol + primaryMessage.dump();
      }
    }
  }, {
    key: "asEncoded",
    value: function asEncoded() {
      return this.envctx.toBase64WebSafe(this.asRaw());
    }
  }, {
    key: "dumpTextContent",
    value: function dumpTextContent(plaintext, html, boundary) {
      var eol = this.envctx.eol;
      var primaryMessage = html !== null && html !== void 0 ? html : plaintext;
      var data = '';
      if (plaintext && html && !this.hasInlineAttachments() && this.hasAttachments()) {
        data = '--' + boundary + eol + 'Content-Type: multipart/alternative; boundary=' + this.boundaries.alt + eol + eol + '--' + this.boundaries.alt + eol + plaintext.dump() + eol + eol + '--' + this.boundaries.alt + eol + html.dump() + eol + eol + '--' + this.boundaries.alt + '--';
      } else if (plaintext && html && this.hasInlineAttachments()) {
        data = '--' + boundary + eol + html.dump();
      } else if (plaintext && html) {
        data = '--' + boundary + eol + plaintext.dump() + eol + eol + '--' + boundary + eol + html.dump();
      } else {
        data = '--' + boundary + eol + primaryMessage.dump();
      }
      return data;
    }
  }, {
    key: "hasInlineAttachments",
    value: function hasInlineAttachments() {
      return this.messages.some(function (msg) {
        return msg.isInlineAttachment();
      });
    }
  }, {
    key: "hasAttachments",
    value: function hasAttachments() {
      return this.messages.some(function (msg) {
        return msg.isAttachment();
      });
    }
  }, {
    key: "getAttachments",
    value: function getAttachments() {
      var _context9;
      var matcher = function matcher(msg) {
        return msg.isAttachment();
      };
      return this.messages.some(matcher) ? (0, _filter.default)(_context9 = this.messages).call(_context9, matcher) : [];
    }
  }, {
    key: "getInlineAttachments",
    value: function getInlineAttachments() {
      var _context10;
      var matcher = function matcher(msg) {
        return msg.isInlineAttachment();
      };
      return this.messages.some(matcher) ? (0, _filter.default)(_context10 = this.messages).call(_context10, matcher) : [];
    }
  }, {
    key: "getMessageByType",
    value: function getMessageByType(type) {
      var _context12;
      var matcher = function matcher(msg) {
        var _context11;
        return !msg.isAttachment() && !msg.isInlineAttachment() && (0, _includes.default)(_context11 = msg.getHeader('Content-Type') || '').call(_context11, type);
      };
      return this.messages.some(matcher) ? (0, _filter.default)(_context12 = this.messages).call(_context12, matcher)[0] : undefined;
    }
  }, {
    key: "addAttachment",
    value: function addAttachment(opts) {
      var _opts$headers$Content, _ref, _opts$headers$Content2, _context13, _context14, _context15;
      if (!this.isObject(opts.headers)) opts.headers = {};
      if (typeof opts.filename !== 'string') {
        throw new _MIMETextError.MIMETextError('MIMETEXT_MISSING_FILENAME', 'The property "filename" must exist while adding attachments.');
      }
      var type = ((_opts$headers$Content = opts.headers['Content-Type']) !== null && _opts$headers$Content !== void 0 ? _opts$headers$Content : opts.contentType) || 'none';
      if (this.envctx.validateContentType(type) === false) {
        throw new _MIMETextError.MIMETextError('MIMETEXT_INVALID_MESSAGE_TYPE', "You specified an invalid content type \"".concat(type, "\"."));
      }
      var encoding = (_ref = (_opts$headers$Content2 = opts.headers['Content-Transfer-Encoding']) !== null && _opts$headers$Content2 !== void 0 ? _opts$headers$Content2 : opts.encoding) !== null && _ref !== void 0 ? _ref : 'base64';
      if (!(0, _includes.default)(_context13 = this.validContentTransferEncodings).call(_context13, encoding)) {
        type = 'application/octet-stream';
      }
      var contentId = opts.headers['Content-ID'];
      if (typeof contentId === 'string' && contentId.length > 2 && (0, _slice.default)(contentId).call(contentId, 0, 1) !== '<' && (0, _slice.default)(contentId).call(contentId, -1) !== '>') {
        opts.headers['Content-ID'] = '<' + opts.headers['Content-ID'] + '>';
      }
      var disposition = opts.inline ? 'inline' : 'attachment';
      opts.headers = (0, _assign.default)({}, opts.headers, {
        'Content-Type': (0, _concat.default)(_context14 = "".concat(type, "; name=\"")).call(_context14, opts.filename, "\""),
        'Content-Transfer-Encoding': encoding,
        'Content-Disposition': (0, _concat.default)(_context15 = "".concat(disposition, "; filename=\"")).call(_context15, opts.filename, "\"")
      });
      return this._addMessage({
        data: opts.data,
        headers: opts.headers
      });
    }
  }, {
    key: "addMessage",
    value: function addMessage(opts) {
      var _opts$headers$Content3, _context16, _ref2, _opts$headers$Content4, _context18, _opts$charset, _context19;
      if (!this.isObject(opts.headers)) opts.headers = {};
      var type = ((_opts$headers$Content3 = opts.headers['Content-Type']) !== null && _opts$headers$Content3 !== void 0 ? _opts$headers$Content3 : opts.contentType) || 'none';
      if (!(0, _includes.default)(_context16 = this.validTypes).call(_context16, type)) {
        var _context17;
        throw new _MIMETextError.MIMETextError('MIMETEXT_INVALID_MESSAGE_TYPE', (0, _concat.default)(_context17 = "Valid content types are ".concat(this.validTypes.join(', '), " but you specified \"")).call(_context17, type, "\"."));
      }
      var encoding = (_ref2 = (_opts$headers$Content4 = opts.headers['Content-Transfer-Encoding']) !== null && _opts$headers$Content4 !== void 0 ? _opts$headers$Content4 : opts.encoding) !== null && _ref2 !== void 0 ? _ref2 : '7bit';
      if (!(0, _includes.default)(_context18 = this.validContentTransferEncodings).call(_context18, encoding)) {
        type = 'application/octet-stream';
      }
      var charset = (_opts$charset = opts.charset) !== null && _opts$charset !== void 0 ? _opts$charset : 'UTF-8';
      opts.headers = (0, _assign.default)({}, opts.headers, {
        'Content-Type': (0, _concat.default)(_context19 = "".concat(type, "; charset=")).call(_context19, charset),
        'Content-Transfer-Encoding': encoding
      });
      return this._addMessage({
        data: opts.data,
        headers: opts.headers
      });
    }
  }, {
    key: "_addMessage",
    value: function _addMessage(opts) {
      var msg = new _MIMEMessageContent.MIMEMessageContent(this.envctx, opts.data, opts.headers);
      this.messages.push(msg);
      return msg;
    }
  }, {
    key: "setSender",
    value: function setSender(input) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        type: 'From'
      };
      var mailbox = new _Mailbox.Mailbox(input, config);
      this.setHeader('From', mailbox);
      return mailbox;
    }
  }, {
    key: "getSender",
    value: function getSender() {
      return this.getHeader('From');
    }
  }, {
    key: "setRecipients",
    value: function setRecipients(input) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        type: 'To'
      };
      var arr = !this.isArray(input) ? [input] : input;
      var recs = (0, _map.default)(arr).call(arr, function (_input) {
        return new _Mailbox.Mailbox(_input, config);
      });
      this.setHeader(config.type, recs);
      return recs;
    }
  }, {
    key: "getRecipients",
    value: function getRecipients() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        type: 'To'
      };
      return this.getHeader(config.type);
    }
  }, {
    key: "setRecipient",
    value: function setRecipient(input) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        type: 'To'
      };
      return this.setRecipients(input, config);
    }
  }, {
    key: "setTo",
    value: function setTo(input) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        type: 'To'
      };
      return this.setRecipients(input, config);
    }
  }, {
    key: "setCc",
    value: function setCc(input) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        type: 'Cc'
      };
      return this.setRecipients(input, config);
    }
  }, {
    key: "setBcc",
    value: function setBcc(input) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        type: 'Bcc'
      };
      return this.setRecipients(input, config);
    }
  }, {
    key: "setSubject",
    value: function setSubject(value) {
      this.setHeader('subject', value);
      return value;
    }
  }, {
    key: "getSubject",
    value: function getSubject() {
      return this.getHeader('subject');
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
      var _context20,
        _this2 = this;
      return (0, _map.default)(_context20 = (0, _keys.default)(obj)).call(_context20, function (prop) {
        return _this2.setHeader(prop, obj[prop]);
      });
    }
  }, {
    key: "getHeaders",
    value: function getHeaders() {
      return this.headers.toObject();
    }
  }, {
    key: "toBase64",
    value: function toBase64(v) {
      return this.envctx.toBase64(v);
    }
  }, {
    key: "toBase64WebSafe",
    value: function toBase64WebSafe(v) {
      return this.envctx.toBase64WebSafe(v);
    }
  }, {
    key: "generateBoundaries",
    value: function generateBoundaries() {
      var _context21, _context22, _context23;
      this.boundaries = {
        mixed: (0, _slice.default)(_context21 = Math.random().toString(36)).call(_context21, 2),
        alt: (0, _slice.default)(_context22 = Math.random().toString(36)).call(_context22, 2),
        related: (0, _slice.default)(_context23 = Math.random().toString(36)).call(_context23, 2)
      };
    }
  }, {
    key: "isArray",
    value: function isArray(v) {
      return !!v && v.constructor === Array;
    }
  }, {
    key: "isObject",
    value: function isObject(v) {
      return !!v && v.constructor === Object;
    }
  }]);
  return MIMEMessage;
}();