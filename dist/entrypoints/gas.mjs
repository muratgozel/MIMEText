import { M as MIMEMessage } from '../shared/mimetext.e0a4943b.mjs';
export { d as MIMEMessageContent, c as MIMEMessageHeader, b as MIMETextError, a as Mailbox } from '../shared/mimetext.e0a4943b.mjs';

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
  return new MIMEMessage(envctx);
}

export { MIMEMessage, createMimeMessage };
