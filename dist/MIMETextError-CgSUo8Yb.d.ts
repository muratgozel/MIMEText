declare class Mailbox {
    reSpecCompliantAddr: RegExp;
    name: string;
    addr: string;
    type: MailboxType;
    constructor(input: MailboxAddrObject | MailboxAddrText | Email, config?: MailboxConfig);
    getAddrDomain(): string;
    dump(): string;
    parse(input: MailboxAddrObject | MailboxAddrText | Email): this;
    isMailboxAddrText(v: unknown): v is MailboxAddrText;
    isMailboxAddrObject(v: unknown): v is MailboxAddrObject;
    isObject(v: unknown): v is object;
}
interface MailboxConfig {
    type: MailboxType;
}
interface MailboxAddrObject {
    addr: string;
    name?: string;
    type?: MailboxType;
}
type MailboxType = 'To' | 'From' | 'Cc' | 'Bcc';
type Email = string;
type MailboxAddrText = string;

declare class MIMEMessageHeader {
    envctx: EnvironmentContext;
    fields: HeaderField[];
    constructor(envctx: EnvironmentContext);
    dump(): string;
    toObject(): HeadersObject;
    get(name: string): string | Mailbox | undefined;
    set(name: string, value: any): HeaderField;
    setCustom(obj: HeaderField): HeaderField;
    validateMailboxSingle(v: unknown): v is Mailbox;
    validateMailboxMulti(v: unknown): boolean;
    dumpMailboxMulti(v: unknown): string;
    dumpMailboxSingle(v: unknown): string;
    isHeaderField(v: unknown): v is HeaderField;
    isObject(v: unknown): v is object;
    isArrayOfMailboxes(v: unknown): v is Mailbox[];
    isArray(v: unknown): v is any[];
}
declare class MIMEMessageContentHeader extends MIMEMessageHeader {
    fields: {
        name: string;
    }[];
    constructor(envctx: EnvironmentContext);
}
type HeadersObject = Record<string, string | Mailbox | undefined>;
interface HeaderField {
    name: string;
    dump?: (v: string | Mailbox | Mailbox[] | undefined) => string;
    value?: string | Mailbox | undefined;
    validate?: (v: unknown) => boolean;
    required?: boolean;
    disabled?: boolean;
    generator?: () => string;
    custom?: boolean;
}

declare class MIMEMessageContent {
    envctx: EnvironmentContext;
    headers: MIMEMessageContentHeader;
    data: string;
    constructor(envctx: EnvironmentContext, data: string, headers?: {});
    dump(): string;
    isAttachment(): boolean;
    isInlineAttachment(): boolean;
    setHeader(name: string, value: any): string;
    getHeader(name: string): string | Mailbox | undefined;
    setHeaders(obj: Record<string, any>): string[];
    getHeaders(): HeadersObject;
}

declare class MIMEMessage {
    envctx: EnvironmentContext;
    headers: MIMEMessageHeader;
    boundaries: Boundaries;
    validTypes: string[];
    validContentTransferEncodings: string[];
    messages: MIMEMessageContent[];
    constructor(envctx: EnvironmentContext);
    asRaw(): string;
    asEncoded(): string;
    dumpTextContent(plaintext: MIMEMessageContent | undefined, html: MIMEMessageContent | undefined, boundary: string): string;
    hasInlineAttachments(): boolean;
    hasAttachments(): boolean;
    getAttachments(): MIMEMessageContent[] | [];
    getInlineAttachments(): MIMEMessageContent[] | [];
    getMessageByType(type: string): MIMEMessageContent | undefined;
    addAttachment(opts: AttachmentOptions): MIMEMessageContent;
    addMessage(opts: ContentOptions): MIMEMessageContent;
    private _addMessage;
    setSender(input: MailboxAddrObject | MailboxAddrText | Email, config?: MailboxConfig): Mailbox;
    getSender(): string | Mailbox | undefined;
    setRecipients(input: MailboxAddrObject | MailboxAddrText | Email | MailboxAddrObject[] | MailboxAddrText[] | Email[], config?: MailboxConfig): Mailbox[];
    getRecipients(config?: MailboxConfig): string | Mailbox | undefined;
    setRecipient(input: MailboxAddrObject | MailboxAddrText | Email | MailboxAddrObject[] | MailboxAddrText[] | Email[], config?: MailboxConfig): Mailbox[];
    setTo(input: MailboxAddrObject | MailboxAddrText | Email | MailboxAddrObject[] | MailboxAddrText[] | Email[], config?: MailboxConfig): Mailbox[];
    setCc(input: MailboxAddrObject | MailboxAddrText | Email | MailboxAddrObject[] | MailboxAddrText[] | Email[], config?: MailboxConfig): Mailbox[];
    setBcc(input: MailboxAddrObject | MailboxAddrText | Email | MailboxAddrObject[] | MailboxAddrText[] | Email[], config?: MailboxConfig): Mailbox[];
    setSubject(value: string): string;
    getSubject(): string | Mailbox | undefined;
    setHeader(name: string, value: any): string;
    getHeader(name: string): string | Mailbox | undefined;
    setHeaders(obj: Record<string, any>): string[];
    getHeaders(): HeadersObject;
    toBase64(v: string): string;
    toBase64WebSafe(v: string): string;
    generateBoundaries(): void;
    isArray(v: unknown): v is any[];
    isObject(v: unknown): v is object;
}
interface EnvironmentContext {
    toBase64: (v: string) => string;
    toBase64WebSafe: (v: string) => string;
    eol: string;
    validateContentType: (v: string) => string | false;
}
interface Boundaries {
    mixed: string;
    alt: string;
    related: string;
}
type ContentTransferEncoding = '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64';
interface ContentHeaders {
    'Content-Type'?: string;
    'Content-Transfer-Encoding'?: ContentTransferEncoding;
    'Content-Disposition'?: string;
    'Content-ID'?: string;
    [index: string]: string | undefined;
}
interface ContentOptions {
    data: string;
    encoding?: ContentTransferEncoding;
    contentType: string;
    headers?: ContentHeaders;
    charset?: string;
}
interface AttachmentOptions extends ContentOptions {
    inline?: boolean;
    filename: string;
}

declare class MIMETextError extends Error {
    name: string;
    description: string;
    constructor(message: string, description?: string);
}

export { type AttachmentOptions as A, type Boundaries as B, type ContentTransferEncoding as C, type EnvironmentContext as E, type HeadersObject as H, MIMEMessage as M, Mailbox as a, MIMETextError as b, MIMEMessageHeader as c, MIMEMessageContent as d, type ContentHeaders as e, type ContentOptions as f, type MailboxConfig as g, type MailboxAddrObject as h, type MailboxType as i, type Email as j, type MailboxAddrText as k, MIMEMessageContentHeader as l, type HeaderField as m };
