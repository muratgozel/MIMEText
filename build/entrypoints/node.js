import { EOL } from 'node:os';
import * as mime from 'mime-types';
import { MIMEMessage } from '../MIMEMessage';
const envctx = {
    toBase64: function toBase64(data) {
        return (new Buffer(data)).toString('base64');
    },
    toBase64WebSafe: function toBase64WebSafe(data) {
        return (new Buffer(data)).toString('base64')
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
export { MIMEMessage } from '../MIMEMessage';
export { Mailbox } from '../Mailbox';
export { MIMETextError } from '../MIMETextError';
export { MIMEMessageHeader } from '../MIMEMessageHeader';
export { MIMEMessageContent } from '../MIMEMessageContent';
