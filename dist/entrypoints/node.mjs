import { EOL } from 'node:os';
import * as mime from 'mime-types';
import { M as MIMEMessage } from '../shared/mimetext.e0a4943b.mjs';
export { d as MIMEMessageContent, c as MIMEMessageHeader, b as MIMETextError, a as Mailbox } from '../shared/mimetext.e0a4943b.mjs';

const envctx = {
  toBase64: function toBase64(data) {
    return Buffer.from(data).toString("base64");
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return Buffer.from(data).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  },
  eol: EOL,
  validateContentType: (v) => {
    return mime.contentType(v);
  }
};
function createMimeMessage() {
  return new MIMEMessage(envctx);
}

export { MIMEMessage, createMimeMessage };
