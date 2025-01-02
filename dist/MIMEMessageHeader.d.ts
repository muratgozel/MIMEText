import type { EnvironmentContext } from "./MIMEMessage";
import { Mailbox } from "./Mailbox.js";
export declare class MIMEMessageHeader {
    envctx: EnvironmentContext;
    fields: HeaderField[];
    constructor(envctx: EnvironmentContext);
    dump(): string;
    toObject(): HeadersObject;
    get(name: string): string | Mailbox | Mailbox[] | undefined;
    set(name: string, value: string | Mailbox | Mailbox[]): HeaderField;
    setCustom(obj: HeaderField): HeaderField;
    validateMailboxSingle(v: unknown): v is Mailbox;
    validateMailboxMulti(v: unknown): boolean;
    dumpMailboxMulti(v: unknown): string;
    dumpMailboxSingle(v: unknown): string;
    isHeaderField(v: unknown): v is HeaderField;
    isObject(v: unknown): v is object;
    isArrayOfMailboxes(v: unknown): v is Mailbox[];
    isArray(v: unknown): v is never[];
}
export declare class MIMEMessageContentHeader extends MIMEMessageHeader {
    fields: {
        name: string;
    }[];
    constructor(envctx: EnvironmentContext);
}
export type HeadersObject = Record<string, string | Mailbox | Mailbox[] | undefined>;
export interface HeaderField {
    name: string;
    dump?: (v: string | Mailbox | Mailbox[] | undefined) => string;
    value?: string | Mailbox | Mailbox[] | undefined;
    validate?: (v: unknown) => boolean;
    required?: boolean;
    disabled?: boolean;
    generator?: () => string;
    custom?: boolean;
}
