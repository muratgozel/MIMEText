import _Reflect$construct from '@babel/runtime-corejs3/core-js/reflect/construct';
import _createClass from '@babel/runtime-corejs3/helpers/createClass';
import _classCallCheck from '@babel/runtime-corejs3/helpers/classCallCheck';
import _inherits from '@babel/runtime-corejs3/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime-corejs3/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime-corejs3/helpers/getPrototypeOf';
import _sliceInstanceProperty from '@babel/runtime-corejs3/core-js/instance/slice';
import _mapInstanceProperty from '@babel/runtime-corejs3/core-js/instance/map';
import _Object$keys from '@babel/runtime-corejs3/core-js/object/keys';
import _indexOfInstanceProperty from '@babel/runtime-corejs3/core-js/instance/index-of';
import _concatInstanceProperty from '@babel/runtime-corejs3/core-js/instance/concat';
import _Object$assign from '@babel/runtime-corejs3/core-js/object/assign';
import _filterInstanceProperty from '@babel/runtime-corejs3/core-js/instance/filter';
import _Array$from from '@babel/runtime-corejs3/core-js/array/from';
import _Symbol from '@babel/runtime-corejs3/core-js/symbol';
import _getIteratorMethod from '@babel/runtime-corejs3/core-js/get-iterator-method';
import _reduceInstanceProperty from '@babel/runtime-corejs3/core-js/instance/reduce';
import _wrapNativeSuper from '@babel/runtime-corejs3/helpers/wrapNativeSuper';
import _trimInstanceProperty from '@babel/runtime-corejs3/core-js/instance/trim';

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var MIMETextError = /*#__PURE__*/function (_Error) {
  _inherits(MIMETextError, _Error);
  var _super = _createSuper$1(MIMETextError);
  function MIMETextError(message, description) {
    var _this;
    _classCallCheck(this, MIMETextError);
    _this = _super.call(this, message);
    _this.description = description ? _trimInstanceProperty(description).call(description).replace(/[\s]{2,}/, ' ') : null;
    _this.name = 'MIMETextError';
    return _this;
  }
  return _createClass(MIMETextError);
}( /*#__PURE__*/_wrapNativeSuper(Error));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof _Symbol !== "undefined" && _getIteratorMethod(o) || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { var _context10; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context10 = Object.prototype.toString.call(o)).call(_context10, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

/*
* Headers are based on: https://www.rfc-editor.org/rfc/rfc4021#section-2.1
* (Some are ignored as they can be added later or as a custom header.)
*/
var MIMEMessageHeader = /*#__PURE__*/function () {
  function MIMEMessageHeader(placement) {
    _classCallCheck(this, MIMEMessageHeader);
    this.maxLineLength = 998;
    this.placement = placement;
    this.store = [{
      placement: 'header',
      name: 'Date',
      // value property is what user sets for this header
      value: null,
      // the generator function generates a value for this header unless
      // user specified a value or user disabled this property
      generator: function generator() {
        return new Date().toGMTString().replace(/GMT|UTC/gi, '+0000');
      },
      disabled: false,
      dump: function dump(v) {
        return v;
      }
    }, {
      placement: 'header',
      name: 'From',
      required: true,
      dump: function dump(v, ctx) {
        var _context;
        return !v.name ? v.dump() : _concatInstanceProperty(_context = "=?utf-8?B?".concat(ctx.toBase64(v.name), "?= <")).call(_context, v.addr, ">");
      }
    }, {
      placement: 'header',
      name: 'Sender',
      dump: function dump(v, ctx) {
        var _context2;
        return !v.name ? v.dump() : _concatInstanceProperty(_context2 = "=?utf-8?B?".concat(ctx.toBase64(v.name), "?= <")).call(_context2, v.addr, ">");
      }
    }, {
      placement: 'header',
      name: 'Reply-To',
      dump: function dump(v) {
        return v;
      }
    }, {
      placement: 'header',
      name: 'To',
      // INFO: "To" field is not required according to the RFC-2822
      //required: true,
      dump: function dump(arr, ctx) {
        return _mapInstanceProperty(arr).call(arr, function (v) {
          var _context3;
          return !v.name ? v.dump() : _concatInstanceProperty(_context3 = "=?utf-8?B?".concat(ctx.toBase64(v.name), "?= <")).call(_context3, v.addr, ">");
        }).join(",\n ");
      }
    }, {
      placement: 'header',
      name: 'Cc',
      dump: function dump(arr, ctx) {
        return _mapInstanceProperty(arr).call(arr, function (v) {
          var _context4;
          return !v.name ? v.dump() : _concatInstanceProperty(_context4 = "=?utf-8?B?".concat(ctx.toBase64(v.name), "?= <")).call(_context4, v.addr, ">");
        }).join(",\n ");
      }
    }, {
      placement: 'header',
      name: 'Bcc',
      dump: function dump(arr, ctx) {
        return _mapInstanceProperty(arr).call(arr, function (v) {
          var _context5;
          return !v.name ? v.dump() : _concatInstanceProperty(_context5 = "=?utf-8?B?".concat(ctx.toBase64(v.name), "?= <")).call(_context5, v.addr, ">");
        }).join(",\n ");
      }
    }, {
      placement: 'header',
      name: 'Message-ID',
      disabled: false,
      generator: function generator(ctx) {
        var _context6, _context7;
        var datestr = Date.now().toString();
        var randomstr = _sliceInstanceProperty(_context6 = Math.random().toString(36)).call(_context6, 2);
        var domain = _filterInstanceProperty(_context7 = ctx.store).call(_context7, function (item) {
          return item.name == 'From';
        })[0].value.getAddrDomain();
        return '<' + randomstr + '-' + datestr + '@' + domain + '>';
      },
      dump: function dump(v) {
        return v;
      }
    }, {
      placement: 'header',
      name: 'Subject',
      required: true,
      dump: function dump(v, ctx) {
        return '=?utf-8?B?' + ctx.toBase64(v) + '?=';
      }
    }, {
      placement: 'header',
      name: 'MIME-Version',
      generator: function generator() {
        return '1.0';
      },
      dump: function dump(v) {
        return v;
      }
    }, {
      placement: 'content',
      name: 'Content-ID',
      dump: function dump(v) {
        return v;
      }
    }, {
      placement: 'content',
      name: 'Content-Type',
      dump: function dump(v) {
        return v;
      }
    }, {
      placement: 'content',
      name: 'Content-Transfer-Encoding',
      dump: function dump(v) {
        return v;
      }
    }, {
      placement: 'content',
      name: 'Content-Disposition',
      dump: function dump(v) {
        return v;
      }
    }];
  }
  _createClass(MIMEMessageHeader, [{
    key: "set",
    value: function set(name, value) {
      var _iterator = _createForOfIteratorHelper(this.store),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          if (item.name.toLowerCase() == name.toLowerCase()) {
            item.value = value;
            return item;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var newHeader = {
        custom: true,
        placement: this.placement,
        name: name,
        value: value,
        dump: function dump(v) {
          return v;
        }
      };
      this.store.push(newHeader);
      return newHeader;
    }
  }, {
    key: "get",
    value: function get(name) {
      var _iterator2 = _createForOfIteratorHelper(this.store),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;
          if (item.name.toLowerCase() == name.toLowerCase()) {
            return item.value;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return undefined;
    }
  }, {
    key: "toObject",
    value: function toObject() {
      var _context8;
      return _reduceInstanceProperty(_context8 = this.store).call(_context8, function (memo, item) {
        memo[item.name] = item.value;
        return memo;
      }, {});
    }
  }, {
    key: "dump",
    value: function dump(envctx) {
      var ctx = {
        toBase64: envctx.toBase64,
        store: this.store
      };
      var lines = '';
      var _iterator3 = _createForOfIteratorHelper(this.store),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _context9;
          var item = _step3.value;
          if (item.placement != this.placement) continue;
          var v = item.value ? item.value : !item.disabled && typeof item.generator == 'function' ? item.generator(ctx) : null;
          if (!v && item.required) {
            throw new MIMETextError('MISSING_HEADER', "The \"".concat(item.name, "\" header is required."));
          }
          if (!v) continue;
          lines += _concatInstanceProperty(_context9 = "".concat(item.name, ": ")).call(_context9, item.dump(v, ctx), "\r\n");
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return _sliceInstanceProperty(lines).call(lines, 0, -2);
    }
  }]);
  return MIMEMessageHeader;
}();

var MIMEMessageContent = /*#__PURE__*/function () {
  function MIMEMessageContent(data) {
    _classCallCheck(this, MIMEMessageContent);
    this.maxLineLen = 78;
    this.data = data;
    this.headers = new MIMEMessageHeader('content');
  }
  _createClass(MIMEMessageContent, [{
    key: "setHeader",
    value: function setHeader() {
      this.headers.set(arguments[0], arguments[1]);
      return this;
    }
  }, {
    key: "setHeaders",
    value: function setHeaders(obj) {
      var _context,
        _this = this;
      _mapInstanceProperty(_context = _Object$keys(obj)).call(_context, function (prop) {
        return _this.setHeader(prop, obj[prop]);
      });
      return this;
    }
  }, {
    key: "getHeaders",
    value: function getHeaders() {
      return this.headers.toObject();
    }
  }, {
    key: "getHeader",
    value: function getHeader(name) {
      return this.headers.get(name);
    }
  }, {
    key: "isAttachment",
    value: function isAttachment() {
      var d = this.headers.get('Content-Disposition');
      return d && _indexOfInstanceProperty(d).call(d, 'attachment') !== -1 ? true : false;
    }
  }, {
    key: "dump",
    value: function dump(envctx, boundaries) {
      var headerBlock = this.headers.dump(envctx);
      if (this.isAttachment()) {
        var _context2, _context3;
        return _concatInstanceProperty(_context2 = _concatInstanceProperty(_context3 = "--".concat(boundaries.mixed, "\n")).call(_context3, headerBlock, "\n\n")).call(_context2, this.data, "\n");
      } else {
        var _context4;
        return _concatInstanceProperty(_context4 = "".concat(headerBlock, "\r\n\r\n")).call(_context4, this.data);
      }
    }
  }]);
  return MIMEMessageContent;
}();

var Mailbox = /*#__PURE__*/function () {
  function Mailbox(input) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      type: 'to'
    };
    _classCallCheck(this, Mailbox);
    this.reSpecCompliantAddr = /(([^<>\n\r]+)\s)?<[^\n\r]+>/;
    this.name = null;
    this.addr = null;
    this.type = opts.type || 'to';
    this.input = input;
    this.inputType = this.findInputType(input);
    this.createMailbox();
  }
  _createClass(Mailbox, [{
    key: "findInputType",
    value: function findInputType(input) {
      if (Object.prototype.toString.call(input) === '[object Object]') {
        if (!input.addr) {
          throw new MIMETextError('INVALID_MAILBOX', "\n          The input should have an \"addr\" property that specifies the email address           of the recipient.\n        ");
        }
        return 'OBJECT';
      } else if (this.reSpecCompliantAddr.test(input)) {
        return 'SPEC_COMPLIANT_TEXT';
      } else if (typeof input == 'string') {
        return 'TEXT';
      } else {
        throw new MIMETextError('INVALID_MAILBOX');
      }
    }
  }, {
    key: "parseSpecCompliantText",
    value: function parseSpecCompliantText(text) {
      var _context, _context2, _context3;
      text = _trimInstanceProperty(text).call(text);
      if (_sliceInstanceProperty(text).call(text, 0, 1) == '<' && _sliceInstanceProperty(text).call(text, -1) == '>') {
        return {
          addr: _sliceInstanceProperty(text).call(text, 1, -1)
        };
      }
      var arr = text.split(' <');
      arr[0] = /^("|')/.test(arr[0]) ? _sliceInstanceProperty(_context = arr[0]).call(_context, 1) : arr[0];
      arr[0] = /("|')$/.test(arr[0]) ? _sliceInstanceProperty(_context2 = arr[0]).call(_context2, 0, -1) : arr[0];
      arr[1] = _sliceInstanceProperty(_context3 = arr[1]).call(_context3, 0, -1);
      return {
        name: arr[0],
        addr: arr[1]
      };
    }
  }, {
    key: "createMailbox",
    value: function createMailbox() {
      switch (this.inputType) {
        case 'OBJECT':
          this.addr = this.input.addr;
          this.name = this.input.name || null;
          this.type = this.input.type || this.type;
          break;
        case 'SPEC_COMPLIANT_TEXT':
          var obj = this.parseSpecCompliantText(this.input);
          this.addr = obj.addr;
          this.name = obj.name || null;
          break;
        case 'TEXT':
          this.addr = this.input;
          break;
      }
    }
  }, {
    key: "getAddrDomain",
    value: function getAddrDomain() {
      if (!this.addr) {
        return '';
      }
      return this.addr.split('@')[1];
    }
  }, {
    key: "dump",
    value: function dump() {
      var result = "<".concat(this.addr, ">");
      if (this.name) {
        var _context4;
        result = _concatInstanceProperty(_context4 = "\"".concat(this.name, "\" ")).call(_context4, result);
      }
      return result;
    }
  }, {
    key: "toObject",
    value: function toObject() {
      return {
        name: this.name,
        addr: this.addr,
        type: this.type
      };
    }
  }]);
  return Mailbox;
}();

var MIMEMessage = /*#__PURE__*/function () {
  function MIMEMessage(envctx) {
    _classCallCheck(this, MIMEMessage);
    this.envctx = envctx;
    this.headers = new MIMEMessageHeader('header');
    this.messages = [];
    this.generateBoundaries();
  }
  _createClass(MIMEMessage, [{
    key: "generateBoundaries",
    value: function generateBoundaries() {
      var _context, _context2;
      this.boundaries = {
        mixed: _sliceInstanceProperty(_context = Math.random().toString(36)).call(_context, 2),
        alt: _sliceInstanceProperty(_context2 = Math.random().toString(36)).call(_context2, 2)
      };
    }
  }, {
    key: "setSender",
    value: function setSender(input) {
      var mailbox = new Mailbox(input, {
        type: 'from'
      });
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
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        type: 'to'
      };
      var recs = [];
      if (Array.isArray(input)) {
        _mapInstanceProperty(input).call(input, function (input) {
          return recs.push(new Mailbox(input, opts));
        });
      } else {
        recs.push(new Mailbox(input, opts));
      }
      this.setHeader(opts.type, recs);
      return recs;
    }
  }, {
    key: "getRecipients",
    value: function getRecipients() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        type: 'to'
      };
      return this.getHeader(opts.type) || [];
    }
  }, {
    key: "setRecipient",
    value: function setRecipient(input) {
      return this.setRecipients(input, {
        type: 'to'
      });
    }
  }, {
    key: "setTo",
    value: function setTo(input) {
      return this.setRecipients(input, {
        type: 'to'
      });
    }
  }, {
    key: "setCc",
    value: function setCc(input) {
      return this.setRecipients(input, {
        type: 'cc'
      });
    }
  }, {
    key: "setBcc",
    value: function setBcc(input) {
      return this.setRecipients(input, {
        type: 'bcc'
      });
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
    value: function setHeader() {
      this.headers.set(arguments[0], arguments[1]);
      return arguments[0];
    }
  }, {
    key: "getHeader",
    value: function getHeader(name) {
      return this.headers.get(name);
    }
  }, {
    key: "setHeaders",
    value: function setHeaders(obj) {
      var _context3,
        _this = this;
      _mapInstanceProperty(_context3 = _Object$keys(obj)).call(_context3, function (prop) {
        return _this.setHeader(prop, obj[prop]);
      });
      return this;
    }
  }, {
    key: "getHeaders",
    value: function getHeaders() {
      return this.headers.toObject();
    }
  }, {
    key: "setMessage",
    value: function setMessage(type, data) {
      var moreHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var validTypes = ['text/html', 'text/plain'];
      if (_indexOfInstanceProperty(validTypes).call(validTypes, type) === -1) {
        var _context4;
        throw new MIMETextError('INVALID_MESSAGE_TYPE', _concatInstanceProperty(_context4 = "\n        Invalid content type for the message. Supported content types         are ".concat(validTypes.join(', '), " but you specified \"")).call(_context4, type, "\".\n      "));
      }
      var headers = _Object$assign({}, moreHeaders, {
        'Content-Type': "".concat(type, "; charset=UTF-8")
      });
      var msg = new MIMEMessageContent(data);
      msg.setHeaders(headers);
      this.messages.push(msg);
      return msg;
    }
  }, {
    key: "setAttachment",
    value: function setAttachment(filename, type, data) {
      var moreHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var headers = _Object$assign({}, moreHeaders, {
        'Content-Type': "".concat(type, "; charset=UTF-8"),
        'Content-Transfer-Encoding': 'base64',
        'Content-Disposition': "attachment;filename=\"".concat(filename, "\"")
      });
      var msg = new MIMEMessageContent(data);
      msg.setHeaders(headers);
      this.messages.push(msg);
      return this;
    }
  }, {
    key: "getMessageByType",
    value: function getMessageByType(type) {
      var _context5;
      var matches = _filterInstanceProperty(_context5 = this.messages).call(_context5, function (m) {
        var _context6;
        return _indexOfInstanceProperty(_context6 = m.getHeader('Content-Type')).call(_context6, type) !== -1;
      });
      if (Array.isArray(matches) && matches.length > 0) {
        return matches[0];
      } else {
        return undefined;
      }
    }
  }, {
    key: "getAttachments",
    value: function getAttachments() {
      var _context7;
      return _filterInstanceProperty(_context7 = this.messages).call(_context7, function (m) {
        return m.isAttachment() === true;
      }) || [];
    }
  }, {
    key: "asRaw",
    value: function asRaw() {
      var lines = this.headers.dump(this.envctx);
      var plainTextMessage = this.getMessageByType('text/plain');
      var htmlMessage = this.getMessageByType('text/html');
      var hasAttachments = this.getAttachments().length > 0;
      var hasPlainTextAlt = plainTextMessage instanceof MIMEMessageContent && htmlMessage instanceof MIMEMessageContent;
      if (hasAttachments && hasPlainTextAlt) return this.asRawMixedAlt(lines);else if (hasAttachments) return this.asRawMixed(lines);else if (hasPlainTextAlt) return this.asRawAlt(lines);else return this.asRawMessage(lines);
    }
  }, {
    key: "asEncoded",
    value: function asEncoded() {
      return this.envctx.toBase64WebSafe(this.asRaw());
    }
  }, {
    key: "asRawMessage",
    value: function asRawMessage(lines) {
      var _context8;
      var plainTextMessage = this.getMessageByType('text/plain');
      var htmlMessage = this.getMessageByType('text/html');
      var message = htmlMessage || plainTextMessage;
      lines = _concatInstanceProperty(_context8 = "".concat(lines, "\n")).call(_context8, message.dump(this.envctx, this.boundaries));
      return lines;
    }
  }, {
    key: "asRawAlt",
    value: function asRawAlt(lines) {
      var _context9, _context10, _context11, _context12, _context13, _context14;
      var plainTextMessage = this.getMessageByType('text/plain');
      var htmlMessage = this.getMessageByType('text/html');
      lines = _concatInstanceProperty(_context9 = _concatInstanceProperty(_context10 = _concatInstanceProperty(_context11 = _concatInstanceProperty(_context12 = _concatInstanceProperty(_context13 = _concatInstanceProperty(_context14 = "".concat(lines, "\nContent-Type: multipart/alternative; boundary=")).call(_context14, this.boundaries.alt, "\n\n--")).call(_context13, this.boundaries.alt, "\n")).call(_context12, plainTextMessage.dump(this.envctx, this.boundaries), "\n\n--")).call(_context11, this.boundaries.alt, "\n")).call(_context10, htmlMessage.dump(this.envctx, this.boundaries), "\n\n--")).call(_context9, this.boundaries.alt, "--");
      return lines;
    }
  }, {
    key: "asRawMixed",
    value: function asRawMixed(lines) {
      var _context15,
        _this2 = this,
        _context16,
        _context17,
        _context18,
        _context19,
        _context20;
      var plainTextMessage = this.getMessageByType('text/plain');
      var htmlMessage = this.getMessageByType('text/html');
      var message = htmlMessage || plainTextMessage;
      var attachments = _mapInstanceProperty(_context15 = this.getAttachments()).call(_context15, function (a) {
        return a.dump(_this2.envctx, _this2.boundaries);
      }).join('').replace(/[\r\n]$/g, '');
      lines = _concatInstanceProperty(_context16 = _concatInstanceProperty(_context17 = _concatInstanceProperty(_context18 = _concatInstanceProperty(_context19 = _concatInstanceProperty(_context20 = "".concat(lines, "\nContent-Type: multipart/mixed; boundary=")).call(_context20, this.boundaries.mixed, "\n\n--")).call(_context19, this.boundaries.mixed, "\n")).call(_context18, message.dump(this.envctx, this.boundaries), "\n\n")).call(_context17, attachments, "\n\n--")).call(_context16, this.boundaries.mixed, "--");
      return lines;
    }
  }, {
    key: "asRawMixedAlt",
    value: function asRawMixedAlt(lines) {
      var _context21,
        _this3 = this,
        _context22,
        _context23,
        _context24,
        _context25,
        _context26,
        _context27,
        _context28,
        _context29,
        _context30,
        _context31;
      var plainTextMessage = this.getMessageByType('text/plain');
      var htmlMessage = this.getMessageByType('text/html');
      var attachments = _mapInstanceProperty(_context21 = this.getAttachments()).call(_context21, function (a) {
        return a.dump(_this3.envctx, _this3.boundaries);
      }).join('').replace(/[\r\n]$/g, '');
      lines = _concatInstanceProperty(_context22 = _concatInstanceProperty(_context23 = _concatInstanceProperty(_context24 = _concatInstanceProperty(_context25 = _concatInstanceProperty(_context26 = _concatInstanceProperty(_context27 = _concatInstanceProperty(_context28 = _concatInstanceProperty(_context29 = _concatInstanceProperty(_context30 = _concatInstanceProperty(_context31 = "".concat(lines, "\nContent-Type: multipart/mixed; boundary=")).call(_context31, this.boundaries.mixed, "\n\n--")).call(_context30, this.boundaries.mixed, "\nContent-Type: multipart/alternative; boundary=")).call(_context29, this.boundaries.alt, "\n\n--")).call(_context28, this.boundaries.alt, "\n")).call(_context27, plainTextMessage.dump(this.envctx, this.boundaries), "\n\n--")).call(_context26, this.boundaries.alt, "\n")).call(_context25, htmlMessage.dump(this.envctx, this.boundaries), "\n\n--")).call(_context24, this.boundaries.alt, "--\n")).call(_context23, attachments, "\n\n--")).call(_context22, this.boundaries.mixed, "--");
      return lines;
    }
  }, {
    key: "toBase64",
    value: function toBase64(v) {
      return this.envctx.toBase64(v);
    }
  }]);
  return MIMEMessage;
}();

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var envctx = {
  toBase64: function toBase64(data) {
    return btoa(data);
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
};
var NodeMIMEMessage = /*#__PURE__*/function (_MIMEMessage) {
  _inherits(NodeMIMEMessage, _MIMEMessage);
  var _super = _createSuper(NodeMIMEMessage);
  function NodeMIMEMessage() {
    _classCallCheck(this, NodeMIMEMessage);
    return _super.call(this, envctx);
  }
  return _createClass(NodeMIMEMessage);
}(MIMEMessage);
function createMimeMessage() {
  return new NodeMIMEMessage();
}

export { createMimeMessage };
//# sourceMappingURL=index.js.map
