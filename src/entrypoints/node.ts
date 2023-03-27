import {EOL} from 'node:os'
import * as mime from 'mime-types'
import {MIMEMessage} from '#src/MIMEMessage'

const envctx = {
    toBase64: function toBase64(data: string) {
        return (new Buffer(data)).toString('base64')
    },
    toBase64WebSafe: function toBase64WebSafe(data: string) {
        return (new Buffer(data)).toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    },
    eol: EOL,
    validateContentType: (v: string): string | false => {
        return mime.contentType(v)
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