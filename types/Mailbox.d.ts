export declare class Mailbox {
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
export interface MailboxConfig {
    type: MailboxType;
}
export interface MailboxAddrObject {
    addr: string;
    name?: string;
    type?: MailboxType;
}
export type MailboxType = 'To' | 'From' | 'Cc' | 'Bcc';
export type Email = string;
export type MailboxAddrText = string;
