import { MIMETextError } from '#src/MIMETextError';
import { Mailbox } from '#src/Mailbox';
/*
    Headers are based on: https://www.rfc-editor.org/rfc/rfc4021#section-2.1
    (Some are ignored as they can be added later or as a custom header.)
*/
export class MIMEMessageHeader {
    envctx;
    fields = [
        {
            name: 'Date',
            generator: () => ((new Date()).toUTCString()).replace(/GMT|UTC/gi, '+0000')
        },
        {
            name: 'From',
            required: true,
            validate: (v) => this.validateMailboxSingle(v),
            dump: (v) => this.dumpMailboxSingle(v)
        },
        {
            name: 'Sender',
            validate: (v) => this.validateMailboxSingle(v),
            dump: (v) => this.dumpMailboxSingle(v)
        },
        {
            name: 'Reply-To',
            validate: (v) => this.validateMailboxSingle(v),
            dump: (v) => this.dumpMailboxSingle(v)
        },
        {
            name: 'To',
            validate: (v) => this.validateMailboxMulti(v),
            dump: (v) => this.dumpMailboxMulti(v)
        },
        {
            name: 'Cc',
            validate: (v) => this.validateMailboxMulti(v),
            dump: (v) => this.dumpMailboxMulti(v)
        },
        {
            name: 'Bcc',
            validate: (v) => this.validateMailboxMulti(v),
            dump: (v) => this.dumpMailboxMulti(v)
        },
        {
            name: 'Message-ID',
            generator: () => {
                const randomstr = Math.random().toString(36).slice(2);
                const from = this.fields.filter((obj) => obj.name === 'From')[0].value;
                const domain = from.getAddrDomain();
                return '<' + randomstr + '@' + domain + '>';
            }
        },
        {
            name: 'Subject',
            required: true,
            dump: (v) => {
                return typeof v === 'string' ? '=?utf-8?B?' + this.envctx.toBase64(v) + '?=' : '';
            }
        },
        {
            name: 'MIME-Version',
            generator: () => '1.0'
        }
    ];
    constructor(envctx) {
        this.envctx = envctx;
    }
    dump() {
        let lines = '';
        for (const field of this.fields) {
            if (field.disabled)
                continue;
            const isValueDefinedByUser = field.value !== undefined && field.value !== null;
            if (!isValueDefinedByUser && field.required) {
                throw new MIMETextError('MIMETEXT_MISSING_HEADER', `The "${field.name}" header is required.`);
            }
            if (!isValueDefinedByUser && typeof field.generator !== 'function')
                continue;
            if (!isValueDefinedByUser && typeof field.generator === 'function')
                field.value = field.generator();
            const strval = Object.hasOwn(field, 'dump') && typeof field.dump === 'function'
                ? field.dump(field.value)
                : typeof field.value === 'string' ? field.value : '';
            lines += `${field.name}: ${strval}${this.envctx.eol}`;
        }
        return lines.slice(0, -1 * this.envctx.eol.length);
    }
    toObject() {
        return this.fields.reduce((memo, item) => {
            memo[item.name] = item.value;
            return memo;
        }, {});
    }
    get(name) {
        const fieldMatcher = (obj) => obj.name.toLowerCase() === name.toLowerCase();
        const ind = this.fields.findIndex(fieldMatcher);
        return ind !== -1 ? this.fields[ind].value : undefined;
    }
    set(name, value) {
        const fieldMatcher = (obj) => obj.name.toLowerCase() === name.toLowerCase();
        const isCustomHeader = !this.fields.some(fieldMatcher);
        if (!isCustomHeader) {
            const ind = this.fields.findIndex(fieldMatcher);
            const field = this.fields[ind];
            if (field.validate && !field.validate(value)) {
                throw new MIMETextError('MIMETEXT_INVALID_HEADER_VALUE', 'You specified an invalid value for the header ' + name);
            }
            this.fields[ind].value = value;
            return this.fields[ind];
        }
        return this.setCustom({
            name: name,
            value: value,
            custom: true,
            dump: (v) => typeof v === 'string' ? v : ''
        });
    }
    setCustom(obj) {
        if (this.isHeaderField(obj)) {
            if (typeof obj.value !== 'string') {
                throw new MIMETextError('MIMETEXT_INVALID_HEADER_FIELD', 'Custom header must have a value.');
            }
            this.fields.push(obj);
            return obj;
        }
        throw new MIMETextError('MIMETEXT_INVALID_HEADER_FIELD', 'You specified an invalid header field object.');
    }
    validateMailboxSingle(v) {
        return v instanceof Mailbox;
    }
    validateMailboxMulti(v) {
        return v instanceof Mailbox || this.isArrayOfMailboxes(v);
    }
    dumpMailboxMulti(v) {
        const dump = (item) => item.name.length === 0
            ? item.dump()
            : `=?utf-8?B?${this.envctx.toBase64(item.name)}?= <${item.addr}>`;
        return this.isArrayOfMailboxes(v) ? v.map(dump).join(`,${this.envctx.eol} `) : v instanceof Mailbox ? dump(v) : '';
    }
    dumpMailboxSingle(v) {
        const dump = (item) => item.name.length === 0
            ? item.dump()
            : `=?utf-8?B?${this.envctx.toBase64(item.name)}?= <${item.addr}>`;
        return v instanceof Mailbox ? dump(v) : '';
    }
    isHeaderField(v) {
        const validProps = ['name', 'value', 'dump', 'required', 'disabled', 'generator', 'custom'];
        if (this.isObject(v)) {
            const h = v;
            if (Object.hasOwn(h, 'name') && typeof h.name === 'string' && h.name.length > 0) {
                if (!Object.keys(h).some((prop) => !validProps.includes(prop))) {
                    return true;
                }
            }
        }
        return false;
    }
    isObject(v) {
        return (!!v) && (v.constructor === Object);
    }
    isArrayOfMailboxes(v) {
        return this.isArray(v) && v.every((item) => item instanceof Mailbox);
    }
    isArray(v) {
        return (!!v) && (v.constructor === Array);
    }
}
export class MIMEMessageContentHeader extends MIMEMessageHeader {
    fields = [
        {
            name: 'Content-ID'
        },
        {
            name: 'Content-Type'
        },
        {
            name: 'Content-Transfer-Encoding'
        },
        {
            name: 'Content-Disposition'
        }
    ];
    constructor(envctx) {
        super(envctx);
    }
}
