import { Base64 } from 'js-base64';
import { M as MIMEMessage } from '../shared/mimetext.e0a4943b.mjs';
export { d as MIMEMessageContent, c as MIMEMessageHeader, b as MIMETextError, a as Mailbox } from '../shared/mimetext.e0a4943b.mjs';

const envctx = {
  toBase64: function toBase64(data) {
    return Base64.encode(data);
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return Base64.encodeURI(data);
  },
  eol: "\r\n",
  validateContentType: (v) => {
    return v.length > 0 ? v : false;
  }
};
function createMimeMessage() {
  return new MIMEMessage(envctx);
}

export { MIMEMessage, createMimeMessage };
