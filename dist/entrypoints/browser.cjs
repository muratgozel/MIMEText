'use strict';

const jsBase64 = require('js-base64');
const MIMEMessage = require('../shared/mimetext.05a07109.cjs');

const envctx = {
  toBase64: function toBase64(data) {
    return jsBase64.Base64.encode(data);
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return jsBase64.Base64.encodeURI(data);
  },
  eol: "\r\n",
  validateContentType: (v) => {
    return v.length > 0 ? v : false;
  }
};
function createMimeMessage() {
  return new MIMEMessage.MIMEMessage(envctx);
}

exports.MIMEMessage = MIMEMessage.MIMEMessage;
exports.MIMEMessageContent = MIMEMessage.MIMEMessageContent;
exports.MIMEMessageHeader = MIMEMessage.MIMEMessageHeader;
exports.MIMETextError = MIMEMessage.MIMETextError;
exports.Mailbox = MIMEMessage.Mailbox;
exports.createMimeMessage = createMimeMessage;
