'use strict';

const node_os = require('node:os');
const mime = require('mime-types');
const MIMEMessage = require('../shared/mimetext.05a07109.cjs');

function _interopNamespaceCompat(e) {
    if (e && typeof e === 'object' && 'default' in e) return e;
    const n = Object.create(null);
    if (e) {
        for (const k in e) {
            n[k] = e[k];
        }
    }
    n.default = e;
    return n;
}

const mime__namespace = /*#__PURE__*/_interopNamespaceCompat(mime);

const envctx = {
  toBase64: function toBase64(data) {
    return Buffer.from(data).toString("base64");
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return Buffer.from(data).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  },
  eol: node_os.EOL,
  validateContentType: (v) => {
    return mime__namespace.contentType(v);
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
