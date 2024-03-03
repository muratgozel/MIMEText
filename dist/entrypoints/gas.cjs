'use strict';

const MIMEMessage = require('../shared/mimetext.05a07109.cjs');

const envctx = {
  toBase64: function toBase64(data) {
    return Utilities.base64Encode(data, Utilities.Charset.UTF_8);
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return Utilities.base64EncodeWebSafe(data);
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
