import type { EnvironmentContext } from './MIMEMessage'
import type { Mailbox } from './Mailbox'
import { type HeadersObject, MIMEMessageContentHeader } from './MIMEMessageHeader.js'

export class MIMEMessageContent {
    envctx: EnvironmentContext
    headers
    data

    constructor (envctx: EnvironmentContext, data: string, headers = {}) {
        this.envctx = envctx
        this.headers = new MIMEMessageContentHeader(this.envctx)
        this.data = data
        this.setHeaders(headers)
    }

    dump (): string {
        const eol = this.envctx.eol
        return this.headers.dump() + eol + eol + this.data
    }

    isAttachment (): boolean {
        const disposition = this.headers.get('Content-Disposition')
        return typeof disposition === 'string' && disposition.includes('attachment')
    }

    isInlineAttachment (): boolean {
        const disposition = this.headers.get('Content-Disposition')
        return typeof disposition === 'string' && disposition.includes('inline')
    }

    setHeader (name: string, value: string | Mailbox | Mailbox[]): string {
        this.headers.set(name, value)
        return name
    }

    getHeader (name: string): string | Mailbox | Mailbox[] | undefined {
        return this.headers.get(name)
    }

    setHeaders (obj: Record<string, string | Mailbox | Mailbox[]>): string[] {
        return Object.keys(obj).map((prop) => this.setHeader(prop, obj[prop]!))
    }

    getHeaders (): HeadersObject {
        return this.headers.toObject()
    }
}
