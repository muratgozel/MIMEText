import {Base64} from 'js-base64'
import {MIMEMessage} from '#src/MIMEMessage'

const envctx = {
    toBase64: function toBase64(data: string) {
        return Base64.encode(data)
    },
    toBase64WebSafe: function toBase64WebSafe(data: string) {
        return Base64.encodeURI(data)
    },
    eol: '\r\n',
    validateContentType: (v: string): string | false => {
        return v.length > 0 ? v : false
    }
}

export function createMimeMessage(): MIMEMessage {
    return new MIMEMessage(envctx)
}

export {MIMEMessage} from '#src/MIMEMessage'
export {Mailbox} from '#src/Mailbox'
export {MIMETextError} from '#src/MIMETextError'
export {MIMEMessageHeader} from '#src/MIMEMessageHeader'
export {MIMEMessageContent} from '#src/MIMEMessageContent'