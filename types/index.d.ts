declare module 'mimetext' {
    export interface MIMETextError extends Error {
        name: string
        description: string
        new(message: string, description: string): MIMETextError
    }

    export interface Mailbox {
        name: string
        addr: string
        type: MailboxType
        reSpecCompliantAddr: RegExp
        new(input: MailboxAddrObject | MailboxAddrText | Email, config: {type: MailboxType}): Mailbox
        getAddrDomain(): string
        dump(): string
        parse(input: MailboxAddrObject | MailboxAddrText | Email): Mailbox
        isMailboxAddrText(v: unknown): v is MailboxAddrText
        isMailboxAddrObject(v: unknown): v is MailboxAddrObject
        isObject(v: unknown): v is object
    }

    export interface MIMEMessageHeader {
        envctx: EnvironmentContext
        fields: HeaderField[]
        new(envctx: EnvironmentContext): MIMEMessageHeader
        dump(): string
        toObject(): object
        get(name: string): string | Mailbox | undefined
        set(name: string, value: any): HeaderField
        setCustom(obj: HeaderField): HeaderField
        validateMailboxSingle(v: unknown): v is Mailbox
        validateMailboxMulti(v: unknown): boolean
        dumpMailboxMulti(v: unknown): string
        dumpMailboxSingle(v: unknown): string
        isHeaderField(v: unknown): v is HeaderField
        isObject(v: unknown): v is object
        isArrayOfMailboxes(v: unknown): v is Mailbox[]
        isArray(v: unknown): v is any[]
    }

    export interface MIMEMessageContentHeader extends MIMEMessageHeader {
        fields: HeaderField[]
        new(envctx: EnvironmentContext): MIMEMessageContentHeader
    }

    export interface MIMEMessageContent {
        envctx: EnvironmentContext
        headers: MIMEMessageContentHeader
        data: string
        new(envctx: EnvironmentContext, data: string, headers?: ContentHeaders): MIMEMessageContent
        dump(): string
        isAttachment(): boolean
        isInlineAttachment(): boolean
        setHeader(name: string, value: any): string
        getHeader(name: string): string | Mailbox | undefined
        setHeaders(obj: {[index: string]: string}): string[]
        getHeaders(): object
    }

    export interface MIMEMessage {
        envctx: EnvironmentContext
        headers: MIMEMessageHeader
        boundaries: Boundaries
        validTypes: ['text/html', 'text/plain']
        validContentTransferEncodings: ['7bit', '8bit', 'binary', 'quoted-printable', 'base64']
        messages: MIMEMessageContent[]
        new(envctx: EnvironmentContext): MIMEMessage
        asRaw(): string
        asEncoded(): string
        dumpTextContent(plaintext: MIMEMessageContent | undefined, html: MIMEMessageContent | undefined, boundary: string): string
        hasInlineAttachments(): boolean
        hasAttachments(): boolean
        getAttachments(): MIMEMessageContent[] | []
        getInlineAttachments(): MIMEMessageContent[] | []
        getMessageByType(type: string): MIMEMessageContent | undefined
        addAttachment(opts: AttachmentOptions): MIMEMessageContent
        addMessage(opts: ContentOptions): MIMEMessageContent
        setSender(input: MailboxAddrObject | MailboxAddrText | Email, config?: {type: MailboxType}): Mailbox
        getSender(): Mailbox | undefined
        setRecipients(input: MailboxAddrObject | MailboxAddrText | Email | MailboxAddrObject[] | MailboxAddrText[] | Email[], config: {type: MailboxType}): Mailbox[]
        getRecipients(config?: {type: MailboxType}): Mailbox | Mailbox[] | undefined
        setRecipient(input: MailboxAddrObject | MailboxAddrText | Email | MailboxAddrObject[] | MailboxAddrText[] | Email[]): Mailbox[]
        setTo(input: MailboxAddrObject | MailboxAddrText | Email | MailboxAddrObject[] | MailboxAddrText[] | Email[]): Mailbox[]
        setCc(input: MailboxAddrObject | MailboxAddrText | Email | MailboxAddrObject[] | MailboxAddrText[] | Email[]): Mailbox[]
        setBcc(input: MailboxAddrObject | MailboxAddrText | Email | MailboxAddrObject[] | MailboxAddrText[] | Email[]): Mailbox[]
        setSubject(value: string): string
        getSubject(): string | undefined
        setHeader(name: string, value: any): string
        getHeader(name: string): string | Mailbox | undefined
        setHeaders(obj: {[index: string]: string}): string[]
        getHeaders(): object
        toBase64(v: string): string
        toBase64WebSafe(v: string): string
        generateBoundaries(): void
        isArray(v: unknown): v is any[]
        isObject(v: unknown): v is object
    }

    // export type Mailbox = import('../src/Mailbox').Mailbox
    // export type MIMEMessage = import('../src/MIMEMessage').MIMEMessage
    // export type MIMETextError = import('../src/MIMETextError').MIMETextError
    // export type MIMEMessageHeader = import('../src/MIMEMessageHeader').MIMEMessageHeader
    // export type MIMEMessageContent = import('../src/MIMEMessageContent').MIMEMessageContent

    export function createMimeMessage (): MIMEMessage

    interface EnvironmentContext {
        toBase64: (v: string) => string,
        toBase64WebSafe: (v: string) => string,
        eol: string,
        validateContentType: (v: string) => string | false
    }

    export type MailboxType = 'To' | 'From' | 'Cc' | 'Bcc'

    export type MailboxAddrObject = {
        addr: string,
        name?: string,
        type?: MailboxType
    }
    export type MailboxAddrText = string
    export type Email = string

    export type HeaderField = {
        name: string,
        dump?: (v: string | Mailbox | Mailbox[] | undefined) => string,
        value?: string | Mailbox | undefined,
        validate?: (v: unknown) => boolean
        required?: boolean,
        disabled?: boolean,
        generator?: () => string,
        custom?: boolean
    }

    export type Boundaries = {
        mixed: string,
        alt: string,
        related: string
    }

    export type ContentTransferEncoding = '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64'

    export type ContentHeaders = {
        'Content-Type'?: string,
        'Content-Transfer-Encoding'?: ContentTransferEncoding,
        'Content-Disposition'?: string,
        'Content-ID'?: string,
        [index: string]: string | undefined
    }

    export type ContentOptions = {
        data: string
        encoding?: ContentTransferEncoding
        contentType: string,
        headers?: ContentHeaders
        charset?: string
    }

    export interface AttachmentOptions extends ContentOptions {
        inline?: boolean,
        filename: string
    }
}