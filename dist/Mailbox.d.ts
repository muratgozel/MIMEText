export declare class Mailbox {
    reSpecCompliantAddr: RegExp;
    name: string;
    addr: string;
    type: MailboxType;
    constructor(input: MailboxAddrObject | string, config?: MailboxConfig);
    getAddrDomain(): string;
    dump(): string;
    parse(input: MailboxAddrObject | string): this;
    isMailboxAddrText(v: unknown): boolean;
    isMailboxAddrObject(v: unknown): v is MailboxAddrObject;
    isObject(v: unknown): v is object;
}
export interface MailboxConfig {
    type: MailboxType;
}
export interface MailboxAddrObject {
    addr: string;
    name?: string;
    type?: MailboxType;
}
export type MailboxType = 'To' | 'From' | 'Cc' | 'Bcc';
