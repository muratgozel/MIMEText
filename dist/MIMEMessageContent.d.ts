import type { EnvironmentContext } from './MIMEMessage';
import type { Mailbox } from './Mailbox';
import { type HeadersObject, MIMEMessageContentHeader } from './MIMEMessageHeader.js';
export declare class MIMEMessageContent {
    envctx: EnvironmentContext;
    headers: MIMEMessageContentHeader;
    data: string;
    constructor(envctx: EnvironmentContext, data: string, headers?: {});
    dump(): string;
    isAttachment(): boolean;
    isInlineAttachment(): boolean;
    setHeader(name: string, value: string | Mailbox | Mailbox[]): string;
    getHeader(name: string): string | Mailbox | Mailbox[] | undefined;
    setHeaders(obj: Record<string, string | Mailbox | Mailbox[]>): string[];
    getHeaders(): HeadersObject;
}
