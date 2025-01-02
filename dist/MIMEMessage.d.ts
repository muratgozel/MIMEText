import type { MailboxAddrObject, MailboxConfig } from './Mailbox.js';
import { type HeadersObject, MIMEMessageHeader } from './MIMEMessageHeader.js';
import { Mailbox } from './Mailbox.js';
import { MIMEMessageContent } from './MIMEMessageContent.js';
export declare class MIMEMessage {
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
    setSender(input: MailboxAddrObject | string, config?: MailboxConfig): Mailbox;
    getSender(): Mailbox | undefined;
    setRecipients(input: MailboxAddrObject | string | MailboxAddrObject[] | string[], config?: MailboxConfig): Mailbox[];
    getRecipients(config?: MailboxConfig): Mailbox | Mailbox[] | undefined;
    setRecipient(input: MailboxAddrObject | string | MailboxAddrObject[] | string[], config?: MailboxConfig): Mailbox[];
    setTo(input: MailboxAddrObject | string | MailboxAddrObject[] | string[], config?: MailboxConfig): Mailbox[];
    setCc(input: MailboxAddrObject | string | MailboxAddrObject[] | string[], config?: MailboxConfig): Mailbox[];
    setBcc(input: MailboxAddrObject | string | MailboxAddrObject[] | string[], config?: MailboxConfig): Mailbox[];
    setSubject(value: string): string;
    getSubject(): string | undefined;
    setHeader(name: string, value: string | Mailbox | Mailbox[]): string;
    getHeader(name: string): string | Mailbox | Mailbox[] | undefined;
    setHeaders(obj: Record<string, string | Mailbox | Mailbox[]>): string[];
    getHeaders(): HeadersObject;
    toBase64(v: string): string;
    toBase64WebSafe(v: string): string;
    generateBoundaries(): void;
    isArray(v: unknown): v is unknown[];
    isObject(v: unknown): v is object;
}
export interface EnvironmentContext {
    toBase64: (v: string) => string;
    toBase64WebSafe: (v: string) => string;
    eol: string;
    validateContentType: (v: string) => string | false;
}
export interface Boundaries {
    mixed: string;
    alt: string;
    related: string;
}
export type ContentTransferEncoding = '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64';
export interface ContentHeaders {
    'Content-Type'?: string;
    'Content-Transfer-Encoding'?: ContentTransferEncoding;
    'Content-Disposition'?: string;
    'Content-ID'?: string;
    [index: string]: string | undefined;
}
export interface ContentOptions {
    data: string;
    encoding?: ContentTransferEncoding;
    contentType: string;
    headers?: ContentHeaders;
    charset?: string;
}
export interface AttachmentOptions extends ContentOptions {
    inline?: boolean;
    filename: string;
}
