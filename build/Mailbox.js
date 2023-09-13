import { MIMETextError } from './MIMETextError.js';
export class Mailbox {
    reSpecCompliantAddr = /(([^<>\r\n]+)\s)?<[^\r\n]+>/;
    name = '';
    addr = '';
    type = 'To';
    constructor(input, config = { type: 'To' }) {
        this.type = config.type;
        this.parse(input);
    }
    getAddrDomain() {
        return this.addr.includes('@') ? this.addr.split('@')[1] : '';
    }
    dump() {
        return this.name ? `"${this.name}" <${this.addr}>` : `<${this.addr}>`;
    }
    parse(input) {
        if (this.isMailboxAddrObject(input)) {
            this.addr = input.addr;
            if (typeof input.name === 'string')
                this.name = input.name;
            if (typeof input.type === 'string')
                this.type = input.type;
            return this;
        }
        if (this.isMailboxAddrText(input)) {
            const text = input.trim();
            if (text.slice(0, 1) == '<' && text.slice(-1) == '>') {
                this.addr = text.slice(1, -1);
                return this;
            }
            const arr = text.split('<');
            arr[0] = arr[0].trim();
            arr[0] = /^("|')/.test(arr[0]) ? arr[0].slice(1) : arr[0];
            arr[0] = /("|')$/.test(arr[0]) ? arr[0].slice(0, -1) : arr[0];
            arr[1] = arr[1].slice(0, -1);
            this.name = arr[0];
            this.addr = arr[1];
            return this;
        }
        if (typeof input === 'string') {
            this.addr = input;
            return this;
        }
        throw new MIMETextError('MIMETEXT_INVALID_MAILBOX', 'Couldn\'t recognize the input.');
    }
    isMailboxAddrText(v) {
        return typeof v === 'string' && this.reSpecCompliantAddr.test(v);
    }
    isMailboxAddrObject(v) {
        return this.isObject(v) && Object.hasOwn(v, 'addr');
    }
    isObject(v) {
        return (!!v) && (v.constructor === Object);
    }
}
