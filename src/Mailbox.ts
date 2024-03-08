import { MIMETextError } from './MIMETextError.js'

export class Mailbox {
    reSpecCompliantAddr = /(([^<>\r\n]+)\s)?<[^\r\n]+>/
    name = ''
    addr = ''
    type: MailboxType = 'To'

    constructor (input: MailboxAddrObject | string, config: MailboxConfig = { type: 'To' }) {
        this.type = config.type

        this.parse(input)
    }

    getAddrDomain (): string {
        if (this.addr.includes('@')) {
            const arr = this.addr.split('@')
            if (arr.length > 1) return arr[1]!
        }
        return ''
    }

    dump (): string {
        return this.name.length > 0 ? `"${this.name}" <${this.addr}>` : `<${this.addr}>`
    }

    parse (input: MailboxAddrObject | string): this {
        if (this.isMailboxAddrObject(input)) {
            this.addr = input.addr
            if (typeof input.name === 'string') this.name = input.name
            if (typeof input.type === 'string') this.type = input.type
            return this
        }

        if (this.isMailboxAddrText(input)) {
            const text = input.trim()
            if (text.startsWith('<') && text.endsWith('>')) {
                this.addr = text.slice(1, -1)
                return this
            }
            const arr = text.split(' <') as [string, string]
            arr[0] = /^("|')/.test(arr[0]) ? arr[0].slice(1) : arr[0]
            arr[0] = /("|')$/.test(arr[0]) ? arr[0].slice(0, -1) : arr[0]
            arr[1] = arr[1].slice(0, -1)
            this.name = arr[0]
            this.addr = arr[1]
            return this
        }

        if (typeof input === 'string') {
            this.addr = input
            return this
        }

        throw new MIMETextError('MIMETEXT_INVALID_MAILBOX', 'Couldn\'t recognize the input.')
    }

    isMailboxAddrText (v: unknown): boolean {
        return typeof v === 'string' && this.reSpecCompliantAddr.test(v)
    }

    isMailboxAddrObject (v: unknown): v is MailboxAddrObject {
        return this.isObject(v) && Object.hasOwn(v, 'addr')
    }

    isObject (v: unknown): v is object {
        return (!!v) && (v.constructor === Object)
    }
}

export interface MailboxConfig {
    type: MailboxType
}
export interface MailboxAddrObject {
    addr: string
    name?: string
    type?: MailboxType
}
export type MailboxType = 'To' | 'From' | 'Cc' | 'Bcc'
