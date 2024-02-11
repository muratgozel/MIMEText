import { MIMEMessage } from '../MIMEMessage.js'

const envctx = {
    toBase64: function toBase64 (data: string) {
        return Utilities.base64Encode(data, Utilities.Charset.UTF_8)
    },
    toBase64WebSafe: function toBase64WebSafe (data: string) {
        return Utilities.base64EncodeWebSafe(data)
    },
    eol: '\r\n',
    validateContentType: (v: string): string | false => {
        return v.length > 0 ? v : false
    }
}

export function createMimeMessage (): MIMEMessage {
    return new MIMEMessage(envctx)
}

export { MIMEMessage } from '../MIMEMessage.js'
export { Mailbox } from '../Mailbox.js'
export { MIMETextError } from '../MIMETextError.js'
export { MIMEMessageHeader } from '../MIMEMessageHeader.js'
export { MIMEMessageContent } from '../MIMEMessageContent.js'

export type * from '../MIMEMessage.js'
export type * from '../Mailbox.js'
export type * from '../MIMETextError.js'
export type * from '../MIMEMessageHeader.js'
export type * from '../MIMEMessageContent.js'
