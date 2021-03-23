declare module "mimetext" {
  export type EmailInput = string | { name: string | null; addr: string };
  export interface EmailOutput {
    name?: string;
    addr: string;
  }
  export interface Attachment {
    type: string;
    filename: string;
    base64Data: string;
  }

  export interface Headers {
    [header: string]: string;
  }

  export interface MIMEMessage {
    createMailboxes(inputs: any): any;
    createMailboxStr(mailboxes: any): string;
    setHeaders(headers: Headers): void;
    setSender(inputs: EmailInput | EmailInput[]): EmailOutput[];
    setRecipient(inputs: EmailInput | EmailInput[]): EmailOutput[];
    setSubject(value: string): void;
    setAttachments(attachments: Attachment | Attachment[]): void;
    setHtmlMessage(msg: string): void;
    setPlainTextMessage(msg: string): void;
    asRaw(): string;
    asEncoded(): string;
    getMessage(): string | null;
    getRecipients(): EmailOutput[] | null;
    getSubject(): string | null;
    getSenders(): EmailOutput[] | null;
    getAttachments(): unknown; // I think this is a string, but the docs say array
    getHeaders(): string | null;
  }

  export interface MIMEMessageClass {
    new (): MIMEMessage;
  }

  declare const MIMEMessage: MIMEMessageClass;
  export default MIMEMessage;
}
