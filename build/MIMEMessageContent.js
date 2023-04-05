import { MIMEMessageContentHeader } from './MIMEMessageHeader.js';
export class MIMEMessageContent {
    envctx;
    headers;
    data;
    constructor(envctx, data, headers = {}) {
        this.envctx = envctx;
        this.headers = new MIMEMessageContentHeader(this.envctx);
        this.data = data;
        this.setHeaders(headers);
    }
    dump() {
        const eol = this.envctx.eol;
        return this.headers.dump() + eol + eol + this.data;
    }
    isAttachment() {
        const disposition = this.headers.get('Content-Disposition');
        return typeof disposition === 'string' && disposition.includes('attachment');
    }
    isInlineAttachment() {
        const disposition = this.headers.get('Content-Disposition');
        return typeof disposition === 'string' && disposition.includes('inline');
    }
    setHeader(name, value) {
        this.headers.set(name, value);
        return name;
    }
    getHeader(name) {
        return this.headers.get(name);
    }
    setHeaders(obj) {
        return Object.keys(obj).map((prop) => this.setHeader(prop, obj[prop]));
    }
    getHeaders() {
        return this.headers.toObject();
    }
}
