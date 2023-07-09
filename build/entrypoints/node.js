import { EOL } from 'node:os';
import * as mime from 'mime-types';
import { MIMEMessage } from '../MIMEMessage.js';
const envctx = {
    toBase64: function toBase64(data) {
        return (Buffer.from(data)).toString('base64');
    },
    toBase64WebSafe: function toBase64WebSafe(data) {
        return (Buffer.from(data)).toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    },
    eol: EOL,
    validateContentType: (v) => {
        return mime.contentType(v);
    }
};
export function createMimeMessage() {
    return new MIMEMessage(envctx);
}
export { MIMEMessage } from '../MIMEMessage.js';
export { Mailbox } from '../Mailbox.js';
export { MIMETextError } from '../MIMETextError.js';
export { MIMEMessageHeader } from '../MIMEMessageHeader.js';
export { MIMEMessageContent } from '../MIMEMessageContent.js';
