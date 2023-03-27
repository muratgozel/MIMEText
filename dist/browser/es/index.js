import _classCallCheck from '@babel/runtime-corejs3/helpers/classCallCheck';
import _createClass from '@babel/runtime-corejs3/helpers/createClass';
import _defineProperty from '@babel/runtime-corejs3/helpers/defineProperty';
import _sliceInstanceProperty from '@babel/runtime-corejs3/core-js/instance/slice';
import _mapInstanceProperty from '@babel/runtime-corejs3/core-js/instance/map';
import _filterInstanceProperty from '@babel/runtime-corejs3/core-js/instance/filter';
import _includesInstanceProperty from '@babel/runtime-corejs3/core-js/instance/includes';
import _Object$assign from '@babel/runtime-corejs3/core-js/object/assign';
import _concatInstanceProperty from '@babel/runtime-corejs3/core-js/instance/concat';
import _Object$keys from '@babel/runtime-corejs3/core-js/object/keys';
import _Reflect$construct from '@babel/runtime-corejs3/core-js/reflect/construct';
import _assertThisInitialized from '@babel/runtime-corejs3/helpers/assertThisInitialized';
import _inherits from '@babel/runtime-corejs3/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime-corejs3/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime-corejs3/helpers/getPrototypeOf';
import _wrapNativeSuper from '@babel/runtime-corejs3/helpers/wrapNativeSuper';
import _Array$from from '@babel/runtime-corejs3/core-js/array/from';
import _Symbol from '@babel/runtime-corejs3/core-js/symbol';
import _getIteratorMethod from '@babel/runtime-corejs3/core-js/get-iterator-method';
import _reduceInstanceProperty from '@babel/runtime-corejs3/core-js/instance/reduce';
import _findIndexInstanceProperty from '@babel/runtime-corejs3/core-js/instance/find-index';
import _trimInstanceProperty from '@babel/runtime-corejs3/core-js/instance/trim';

/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
const version = '3.7.5';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = version;
const _hasatob = typeof atob === 'function';
const _hasbtoa = typeof btoa === 'function';
const _hasBuffer = typeof Buffer === 'function';
const _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
const _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const b64chs = Array.prototype.slice.call(b64ch);
const b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
})(b64chs);
const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
const _fromCC = String.fromCharCode.bind(String);
const _U8Afrom = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
const _mkUriSafe = (src) => src
    .replace(/=/g, '').replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_');
const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
/**
 * polyfill version of `btoa`
 */
const btoaPolyfill = (bin) => {
    // console.log('polyfilled');
    let u32, c0, c1, c2, asc = '';
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length;) {
        if ((c0 = bin.charCodeAt(i++)) > 255 ||
            (c1 = bin.charCodeAt(i++)) > 255 ||
            (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError('invalid character found');
        u32 = (c0 << 16) | (c1 << 8) | c2;
        asc += b64chs[u32 >> 18 & 63]
            + b64chs[u32 >> 12 & 63]
            + b64chs[u32 >> 6 & 63]
            + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
const _btoa = _hasbtoa ? (bin) => btoa(bin)
    : _hasBuffer ? (bin) => Buffer.from(bin, 'binary').toString('base64')
        : btoaPolyfill;
const _fromUint8Array = _hasBuffer
    ? (u8a) => Buffer.from(u8a).toString('base64')
    : (u8a) => {
        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
        const maxargs = 0x1000;
        let strs = [];
        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(''));
    };
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
 * @returns {string} Base64 string
 */
const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const utob = (src: string) => unescape(encodeURIComponent(src));
// reverting good old fationed regexp
const cb_utob = (c) => {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                + _fromCC(0x80 | (cc & 0x3f)))
                : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                    + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                    + _fromCC(0x80 | (cc & 0x3f)));
    }
    else {
        var cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
            + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
            + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
            + _fromCC(0x80 | (cc & 0x3f)));
    }
};
const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob = (u) => u.replace(re_utob, cb_utob);
//
const _encode = _hasBuffer
    ? (s) => Buffer.from(s, 'utf8').toString('base64')
    : _TE
        ? (s) => _fromUint8Array(_TE.encode(s))
        : (s) => _btoa(utob(s));
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [urlsafe] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
const encode = (src, urlsafe = false) => urlsafe
    ? _mkUriSafe(_encode(src))
    : _encode(src);
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
 * @returns {string} Base64 string
 */
const encodeURI = (src) => encode(src, true);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const btou = (src: string) => decodeURIComponent(escape(src));
// reverting good old fationed regexp
const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
const cb_btou = (cccc) => {
    switch (cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                | ((0x3f & cccc.charCodeAt(1)) << 12)
                | ((0x3f & cccc.charCodeAt(2)) << 6)
                | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
            return (_fromCC((offset >>> 10) + 0xD800)
                + _fromCC((offset & 0x3FF) + 0xDC00));
        case 3:
            return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                | (0x3f & cccc.charCodeAt(2)));
        default:
            return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                | (0x3f & cccc.charCodeAt(1)));
    }
};
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou = (b) => b.replace(re_btou, cb_btou);
/**
 * polyfill version of `atob`
 */
const atobPolyfill = (asc) => {
    // console.log('polyfilled');
    asc = asc.replace(/\s+/g, '');
    if (!b64re.test(asc))
        throw new TypeError('malformed base64.');
    asc += '=='.slice(2 - (asc.length & 3));
    let u24, bin = '', r1, r2;
    for (let i = 0; i < asc.length;) {
        u24 = b64tab[asc.charAt(i++)] << 18
            | b64tab[asc.charAt(i++)] << 12
            | (r1 = b64tab[asc.charAt(i++)]) << 6
            | (r2 = b64tab[asc.charAt(i++)]);
        bin += r1 === 64 ? _fromCC(u24 >> 16 & 255)
            : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
                : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
};
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
const _atob = _hasatob ? (asc) => atob(_tidyB64(asc))
    : _hasBuffer ? (asc) => Buffer.from(asc, 'base64').toString('binary')
        : atobPolyfill;
//
const _toUint8Array = _hasBuffer
    ? (a) => _U8Afrom(Buffer.from(a, 'base64'))
    : (a) => _U8Afrom(_atob(a).split('').map(c => c.charCodeAt(0)));
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array = (a) => _toUint8Array(_unURI(a));
//
const _decode = _hasBuffer
    ? (a) => Buffer.from(a, 'base64').toString('utf8')
    : _TD
        ? (a) => _TD.decode(_toUint8Array(a))
        : (a) => btou(_atob(a));
const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
const decode = (src) => _decode(_unURI(src));
/**
 * check if a value is a valid Base64 string
 * @param {String} src a value to check
  */
const isValid = (src) => {
    if (typeof src !== 'string')
        return false;
    const s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
//
const _noEnum = (v) => {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
/**
 * extend String.prototype with relevant methods
 */
const extendString = function () {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add('fromBase64', function () { return decode(this); });
    _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
    _add('toBase64URI', function () { return encode(this, true); });
    _add('toBase64URL', function () { return encode(this, true); });
    _add('toUint8Array', function () { return toUint8Array(this); });
};
/**
 * extend Uint8Array.prototype with relevant methods
 */
const extendUint8Array = function () {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
    _add('toBase64URI', function () { return fromUint8Array(this, true); });
    _add('toBase64URL', function () { return fromUint8Array(this, true); });
};
/**
 * extend Builtin prototypes with relevant methods
 */
const extendBuiltins = () => {
    extendString();
    extendUint8Array();
};
const gBase64 = {
    version: version,
    VERSION: VERSION,
    atob: _atob,
    atobPolyfill: atobPolyfill,
    btoa: _btoa,
    btoaPolyfill: btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode: encode,
    encodeURI: encodeURI,
    encodeURL: encodeURI,
    utob: utob,
    btou: btou,
    decode: decode,
    isValid: isValid,
    fromUint8Array: fromUint8Array,
    toUint8Array: toUint8Array,
    extendString: extendString,
    extendUint8Array: extendUint8Array,
    extendBuiltins: extendBuiltins,
};

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var MIMETextError = /*#__PURE__*/function (_Error) {
  _inherits(MIMETextError, _Error);
  var _super = _createSuper$1(MIMETextError);
  function MIMETextError(message) {
    var _this;
    var description = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    _classCallCheck(this, MIMETextError);
    _this = _super.call(this, description);
    _defineProperty(_assertThisInitialized(_this), "name", '');
    _defineProperty(_assertThisInitialized(_this), "description", '');
    _this.name = message;
    _this.description = description;
    return _this;
  }
  return _createClass(MIMETextError);
}( /*#__PURE__*/_wrapNativeSuper(Error));

var Mailbox = /*#__PURE__*/function () {
  function Mailbox(input) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      type: 'To'
    };
    _classCallCheck(this, Mailbox);
    _defineProperty(this, "reSpecCompliantAddr", /(([^<>\r\n]+)\s)?<[^\r\n]+>/);
    _defineProperty(this, "name", '');
    _defineProperty(this, "addr", '');
    _defineProperty(this, "type", 'To');
    this.type = config.type;
    this.parse(input);
  }
  _createClass(Mailbox, [{
    key: "getAddrDomain",
    value: function getAddrDomain() {
      var _context;
      return _includesInstanceProperty(_context = this.addr).call(_context, '@') ? this.addr.split('@')[1] : '';
    }
  }, {
    key: "dump",
    value: function dump() {
      var _context2;
      return this.name ? _concatInstanceProperty(_context2 = "\"".concat(this.name, "\" <")).call(_context2, this.addr, ">") : "<".concat(this.addr, ">");
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
        var text = _trimInstanceProperty(input).call(input);
        if (_sliceInstanceProperty(text).call(text, 0, 1) == '<' && _sliceInstanceProperty(text).call(text, -1) == '>') {
          this.addr = _sliceInstanceProperty(text).call(text, 1, -1);
          return this;
        }
        var arr = text.split(' <');
        arr[0] = /^("|')/.test(arr[0]) ? _sliceInstanceProperty(_context3 = arr[0]).call(_context3, 1) : arr[0];
        arr[0] = /("|')$/.test(arr[0]) ? _sliceInstanceProperty(_context4 = arr[0]).call(_context4, 0, -1) : arr[0];
        arr[1] = _sliceInstanceProperty(_context5 = arr[1]).call(_context5, 0, -1);
        this.name = arr[0];
        this.addr = arr[1];
        return this;
      }
      if (typeof input === 'string') {
        this.addr = input;
        return this;
      }
      throw new MIMETextError('MIMETEXT_INVALID_MAILBOX', 'Couldn\'t recognize the input.');
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

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof _Symbol !== "undefined" && _getIteratorMethod(o) || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { var _context10; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = _sliceInstanceProperty(_context10 = Object.prototype.toString.call(o)).call(_context10, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return _Array$from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/*
    Headers are based on: https://www.rfc-editor.org/rfc/rfc4021#section-2.1
    (Some are ignored as they can be added later or as a custom header.)
*/
var MIMEMessageHeader = /*#__PURE__*/function () {
  function MIMEMessageHeader(envctx) {
    var _this = this;
    _classCallCheck(this, MIMEMessageHeader);
    _defineProperty(this, "envctx", void 0);
    _defineProperty(this, "fields", [{
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
        var randomstr = _sliceInstanceProperty(_context = Math.random().toString(36)).call(_context, 2);
        var from = _filterInstanceProperty(_context2 = _this.fields).call(_context2, function (obj) {
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
  _createClass(MIMEMessageHeader, [{
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
            throw new MIMETextError('MIMETEXT_MISSING_HEADER', "The \"".concat(field.name, "\" header is required."));
          }
          if (!isValueDefinedByUser && typeof field.generator !== 'function') continue;
          if (!isValueDefinedByUser && typeof field.generator === 'function') field.value = field.generator();
          var strval = Object.hasOwn(field, 'dump') && typeof field.dump === 'function' ? field.dump(field.value) : typeof field.value === 'string' ? field.value : '';
          lines += _concatInstanceProperty(_context3 = _concatInstanceProperty(_context4 = "".concat(field.name, ": ")).call(_context4, strval)).call(_context3, this.envctx.eol);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return _sliceInstanceProperty(lines).call(lines, 0, -1 * this.envctx.eol.length);
    }
  }, {
    key: "toObject",
    value: function toObject() {
      var _context5;
      return _reduceInstanceProperty(_context5 = this.fields).call(_context5, function (memo, item) {
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
      var ind = _findIndexInstanceProperty(_context6 = this.fields).call(_context6, fieldMatcher);
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
        var ind = _findIndexInstanceProperty(_context7 = this.fields).call(_context7, fieldMatcher);
        var field = this.fields[ind];
        if (field.validate && !field.validate(value)) {
          throw new MIMETextError('MIMETEXT_INVALID_HEADER_VALUE', 'You specified an invalid value for the header ' + name);
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
          throw new MIMETextError('MIMETEXT_INVALID_HEADER_FIELD', 'Custom header must have a value.');
        }
        this.fields.push(obj);
        return obj;
      }
      throw new MIMETextError('MIMETEXT_INVALID_HEADER_FIELD', 'You specified an invalid header field object.');
    }
  }, {
    key: "validateMailboxSingle",
    value: function validateMailboxSingle(v) {
      return v instanceof Mailbox;
    }
  }, {
    key: "validateMailboxMulti",
    value: function validateMailboxMulti(v) {
      return v instanceof Mailbox || this.isArrayOfMailboxes(v);
    }
  }, {
    key: "dumpMailboxMulti",
    value: function dumpMailboxMulti(v) {
      var _this2 = this;
      var dump = function dump(item) {
        var _context8;
        return item.name.length === 0 ? item.dump() : _concatInstanceProperty(_context8 = "=?utf-8?B?".concat(_this2.envctx.toBase64(item.name), "?= <")).call(_context8, item.addr, ">");
      };
      return this.isArrayOfMailboxes(v) ? _mapInstanceProperty(v).call(v, dump).join(",".concat(this.envctx.eol, " ")) : v instanceof Mailbox ? dump(v) : '';
    }
  }, {
    key: "dumpMailboxSingle",
    value: function dumpMailboxSingle(v) {
      var _this3 = this;
      var dump = function dump(item) {
        var _context9;
        return item.name.length === 0 ? item.dump() : _concatInstanceProperty(_context9 = "=?utf-8?B?".concat(_this3.envctx.toBase64(item.name), "?= <")).call(_context9, item.addr, ">");
      };
      return v instanceof Mailbox ? dump(v) : '';
    }
  }, {
    key: "isHeaderField",
    value: function isHeaderField(v) {
      var validProps = ['name', 'value', 'dump', 'required', 'disabled', 'generator', 'custom'];
      if (this.isObject(v)) {
        var h = v;
        if (Object.hasOwn(h, 'name') && typeof h.name === 'string' && h.name.length > 0) {
          if (!_Object$keys(h).some(function (prop) {
            return !_includesInstanceProperty(validProps).call(validProps, prop);
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
        return item instanceof Mailbox;
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
var MIMEMessageContentHeader = /*#__PURE__*/function (_MIMEMessageHeader) {
  _inherits(MIMEMessageContentHeader, _MIMEMessageHeader);
  var _super = _createSuper(MIMEMessageContentHeader);
  function MIMEMessageContentHeader(envctx) {
    var _this4;
    _classCallCheck(this, MIMEMessageContentHeader);
    _this4 = _super.call(this, envctx);
    _defineProperty(_assertThisInitialized(_this4), "fields", [{
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
  return _createClass(MIMEMessageContentHeader);
}(MIMEMessageHeader);

var MIMEMessageContent = /*#__PURE__*/function () {
  function MIMEMessageContent(envctx, data) {
    var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, MIMEMessageContent);
    _defineProperty(this, "envctx", void 0);
    _defineProperty(this, "headers", void 0);
    _defineProperty(this, "data", void 0);
    this.envctx = envctx;
    this.headers = new MIMEMessageContentHeader(this.envctx);
    this.data = data;
    this.setHeaders(headers);
  }
  _createClass(MIMEMessageContent, [{
    key: "dump",
    value: function dump() {
      var eol = this.envctx.eol;
      return this.headers.dump() + eol + eol + this.data;
    }
  }, {
    key: "isAttachment",
    value: function isAttachment() {
      var disposition = this.headers.get('Content-Disposition');
      return typeof disposition === 'string' && _includesInstanceProperty(disposition).call(disposition, 'attachment');
    }
  }, {
    key: "isInlineAttachment",
    value: function isInlineAttachment() {
      var disposition = this.headers.get('Content-Disposition');
      return typeof disposition === 'string' && _includesInstanceProperty(disposition).call(disposition, 'inline');
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
      return _mapInstanceProperty(_context = _Object$keys(obj)).call(_context, function (prop) {
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

var MIMEMessage = /*#__PURE__*/function () {
  function MIMEMessage(envctx) {
    _classCallCheck(this, MIMEMessage);
    _defineProperty(this, "envctx", void 0);
    _defineProperty(this, "headers", void 0);
    _defineProperty(this, "boundaries", {
      mixed: '',
      alt: '',
      related: ''
    });
    _defineProperty(this, "validTypes", ['text/html', 'text/plain']);
    _defineProperty(this, "validContentTransferEncodings", ['7bit', '8bit', 'binary', 'quoted-printable', 'base64']);
    _defineProperty(this, "messages", []);
    this.envctx = envctx;
    this.headers = new MIMEMessageHeader(this.envctx);
    this.messages = [];
    this.generateBoundaries();
  }
  _createClass(MIMEMessage, [{
    key: "asRaw",
    value: function asRaw() {
      var _this = this;
      var eol = this.envctx.eol;
      var lines = this.headers.dump();
      var plaintext = this.getMessageByType('text/plain');
      var html = this.getMessageByType('text/html');
      var primaryMessage = html ? html : plaintext ? plaintext : undefined;
      if (primaryMessage === undefined) {
        throw new MIMETextError('MIMETEXT_MISSING_BODY', 'No content added to the message.');
      }
      var hasAttachments = this.hasAttachments();
      var hasInlineAttachments = this.hasInlineAttachments();
      var structure = hasInlineAttachments && hasAttachments ? 'mixed+related' : hasAttachments ? 'mixed' : hasInlineAttachments ? 'related' : plaintext && html ? 'alternative' : '';
      if (structure === 'mixed+related') {
        var _context, _context2, _context3, _context4;
        var attachments = _sliceInstanceProperty(_context = _mapInstanceProperty(_context2 = this.getAttachments()).call(_context2, function (a) {
          return '--' + _this.boundaries.mixed + eol + a.dump() + eol + eol;
        }).join('')).call(_context, 0, -1 * eol.length);
        var inlineAttachments = _sliceInstanceProperty(_context3 = _mapInstanceProperty(_context4 = this.getInlineAttachments()).call(_context4, function (a) {
          return '--' + _this.boundaries.related + eol + a.dump() + eol + eol;
        }).join('')).call(_context3, 0, -1 * eol.length);
        return lines + eol + 'Content-Type: multipart/mixed; boundary=' + this.boundaries.mixed + eol + eol + '--' + this.boundaries.mixed + eol + 'Content-Type: multipart/related; boundary=' + this.boundaries.related + eol + eol + this.dumpTextContent(plaintext, html, this.boundaries.related) + eol + eol + inlineAttachments + '--' + this.boundaries.related + '--' + eol + attachments + '--' + this.boundaries.mixed + '--';
      } else if (structure === 'mixed') {
        var _context5, _context6;
        var _attachments = _sliceInstanceProperty(_context5 = _mapInstanceProperty(_context6 = this.getAttachments()).call(_context6, function (a) {
          return '--' + _this.boundaries.mixed + eol + a.dump() + eol + eol;
        }).join('')).call(_context5, 0, -1 * eol.length);
        return lines + eol + 'Content-Type: multipart/mixed; boundary=' + this.boundaries.mixed + eol + eol + this.dumpTextContent(plaintext, html, this.boundaries.mixed) + eol + (plaintext && html ? '' : eol) + _attachments + '--' + this.boundaries.mixed + '--';
      } else if (structure === 'related') {
        var _context7, _context8;
        var _inlineAttachments = _sliceInstanceProperty(_context7 = _mapInstanceProperty(_context8 = this.getInlineAttachments()).call(_context8, function (a) {
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
      var primaryMessage = html ? html : plaintext;
      var data = '';
      if (plaintext && html && !this.hasInlineAttachments() && this.hasAttachments()) data = '--' + boundary + eol + 'Content-Type: multipart/alternative; boundary=' + this.boundaries.alt + eol + eol + '--' + this.boundaries.alt + eol + plaintext.dump() + eol + eol + '--' + this.boundaries.alt + eol + html.dump() + eol + eol + '--' + this.boundaries.alt + '--';else if (plaintext && html && this.hasInlineAttachments()) data = '--' + boundary + eol + html.dump();else if (plaintext && html) data = '--' + boundary + eol + plaintext.dump() + eol + eol + '--' + boundary + eol + html.dump();else data = '--' + boundary + eol + primaryMessage.dump();
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
      return this.messages.some(matcher) ? _filterInstanceProperty(_context9 = this.messages).call(_context9, matcher) : [];
    }
  }, {
    key: "getInlineAttachments",
    value: function getInlineAttachments() {
      var _context10;
      var matcher = function matcher(msg) {
        return msg.isInlineAttachment();
      };
      return this.messages.some(matcher) ? _filterInstanceProperty(_context10 = this.messages).call(_context10, matcher) : [];
    }
  }, {
    key: "getMessageByType",
    value: function getMessageByType(type) {
      var _context12;
      var matcher = function matcher(msg) {
        var _context11;
        return _includesInstanceProperty(_context11 = msg.getHeader('Content-Type') || '').call(_context11, type);
      };
      return this.messages.some(matcher) ? _filterInstanceProperty(_context12 = this.messages).call(_context12, matcher)[0] : undefined;
    }
  }, {
    key: "addAttachment",
    value: function addAttachment(opts) {
      var _context13, _context14, _context15;
      if (!this.isObject(opts.headers)) opts.headers = {};
      if (typeof opts.filename !== 'string') {
        throw new MIMETextError('MIMETEXT_MISSING_FILENAME', 'The property filename must exist while adding attachments.');
      }
      var type = opts.headers['Content-Type'] || opts.contentType || 'none';
      if (this.envctx.validateContentType(type) === false) {
        throw new MIMETextError('MIMETEXT_INVALID_MESSAGE_TYPE', "You specified an invalid content type \"".concat(type, "\"."));
      }
      var encoding = opts.headers['Content-Transfer-Encoding'] || opts.encoding || 'base64';
      if (!_includesInstanceProperty(_context13 = this.validContentTransferEncodings).call(_context13, encoding)) {
        type = 'application/octet-stream';
      }
      var contentId = opts.headers['Content-ID'];
      if (typeof contentId === 'string' && contentId.length > 2 && _sliceInstanceProperty(contentId).call(contentId, 0, 1) !== '<' && _sliceInstanceProperty(contentId).call(contentId, -1) !== '>') {
        opts.headers['Content-ID'] = '<' + opts.headers['Content-ID'] + '>';
      }
      var disposition = opts.inline ? 'inline' : 'attachment';
      opts.headers = _Object$assign({}, opts.headers, {
        'Content-Type': _concatInstanceProperty(_context14 = "".concat(type, "; name=\"")).call(_context14, opts.filename, "\""),
        'Content-Transfer-Encoding': encoding,
        'Content-Disposition': _concatInstanceProperty(_context15 = "".concat(disposition, "; filename=\"")).call(_context15, opts.filename, "\"")
      });
      return this._addMessage({
        data: opts.data,
        headers: opts.headers
      });
    }
  }, {
    key: "addMessage",
    value: function addMessage(opts) {
      var _context16, _context18, _context19;
      if (!this.isObject(opts.headers)) opts.headers = {};
      var type = opts.headers['Content-Type'] || opts.contentType || 'none';
      if (!_includesInstanceProperty(_context16 = this.validTypes).call(_context16, type)) {
        var _context17;
        throw new MIMETextError('MIMETEXT_INVALID_MESSAGE_TYPE', _concatInstanceProperty(_context17 = "Valid content types are ".concat(this.validTypes.join(', '), " but you specified \"")).call(_context17, type, "\"."));
      }
      var encoding = opts.headers['Content-Transfer-Encoding'] || opts.encoding || '7bit';
      if (!_includesInstanceProperty(_context18 = this.validContentTransferEncodings).call(_context18, encoding)) {
        type = 'application/octet-stream';
      }
      var charset = opts.charset || 'UTF-8';
      opts.headers = _Object$assign({}, opts.headers, {
        'Content-Type': _concatInstanceProperty(_context19 = "".concat(type, "; charset=")).call(_context19, charset),
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
      var msg = new MIMEMessageContent(this.envctx, opts.data, opts.headers);
      this.messages.push(msg);
      return msg;
    }
  }, {
    key: "setSender",
    value: function setSender(input) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        type: 'From'
      };
      var mailbox = new Mailbox(input, config);
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
      var recs = _mapInstanceProperty(arr).call(arr, function (_input) {
        return new Mailbox(_input, config);
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
      return this.setRecipients(input, {
        type: 'To'
      });
    }
  }, {
    key: "setTo",
    value: function setTo(input) {
      return this.setRecipients(input, {
        type: 'To'
      });
    }
  }, {
    key: "setCc",
    value: function setCc(input) {
      return this.setRecipients(input, {
        type: 'Cc'
      });
    }
  }, {
    key: "setBcc",
    value: function setBcc(input) {
      return this.setRecipients(input, {
        type: 'Bcc'
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
      return _mapInstanceProperty(_context20 = _Object$keys(obj)).call(_context20, function (prop) {
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
        mixed: _sliceInstanceProperty(_context21 = Math.random().toString(36)).call(_context21, 2),
        alt: _sliceInstanceProperty(_context22 = Math.random().toString(36)).call(_context22, 2),
        related: _sliceInstanceProperty(_context23 = Math.random().toString(36)).call(_context23, 2)
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

var envctx = {
  toBase64: function toBase64(data) {
    return gBase64.encode(data);
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return gBase64.encodeURI(data);
  },
  eol: '\r\n',
  validateContentType: function validateContentType(v) {
    return v.length > 0 ? v : false;
  }
};
function createMimeMessage() {
  return new MIMEMessage(envctx);
}

export { MIMEMessage, MIMEMessageContent, MIMEMessageHeader, MIMETextError, Mailbox, createMimeMessage };
//# sourceMappingURL=index.js.map
