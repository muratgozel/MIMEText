"use strict";

var _Reflect$construct = require("@babel/runtime-corejs3/core-js/reflect/construct");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MIMETextError = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));
var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapNativeSuper"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, _isNativeReflectConstruct() ? _Reflect$construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var MIMETextError = exports.MIMETextError = /*#__PURE__*/function (_Error) {
  (0, _inherits2.default)(MIMETextError, _Error);
  function MIMETextError(message) {
    var _this;
    var description = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    (0, _classCallCheck2.default)(this, MIMETextError);
    _this = _callSuper(this, MIMETextError, [description]);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "name", '');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "description", '');
    _this.name = message;
    _this.description = description;
    return _this;
  }
  return (0, _createClass2.default)(MIMETextError);
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));