class MIMETextError extends Error {
  constructor(message, description) {
    super(message);
    this.description = description ? description.trim().replace(/[\s]{2,}/, ' ') : null;
    this.name = 'MIMETextError';
  }
}

/*
* Headers are based on: https://www.rfc-editor.org/rfc/rfc4021#section-2.1
* (Some are ignored as they can be added later or as a custom header.)
*/

class MIMEMessageHeader {
  constructor(placement) {
    this.maxLineLength = 998;
    this.placement = placement;
    this.store = [
      {
        placement: 'header',
        name: 'Date',
        // value property is what user sets for this header
        value: null,
        // the generator function generates a value for this header unless
        // user specified a value or user disabled this property
        generator: () => (new Date().toGMTString()).replace(/GMT|UTC/gi, '+0000'),
        disabled: false,
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'header',
        name: 'From',
        required: true,
        dump: (v, ctx) => !v.name ? v.dump() : `=?utf-8?B?${ctx.toBase64(v.name)}?= <${v.addr}>`
      },
      {
        placement: 'header',
        name: 'Sender',
        dump: (v, ctx) => !v.name ? v.dump() : `=?utf-8?B?${ctx.toBase64(v.name)}?= <${v.addr}>`
      },
      {
        placement: 'header',
        name: 'Reply-To',
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'header',
        name: 'To',
        // INFO: "To" field is not required according to the RFC-2822
        //required: true,
        dump: (arr, ctx) => arr.map(v => !v.name ? v.dump() : `=?utf-8?B?${ctx.toBase64(v.name)}?= <${v.addr}>`).join(",\n ")
      },
      {
        placement: 'header',
        name: 'Cc',
        dump: (arr, ctx) => arr.map(v => !v.name ? v.dump() : `=?utf-8?B?${ctx.toBase64(v.name)}?= <${v.addr}>`).join(",\n ")
      },
      {
        placement: 'header',
        name: 'Bcc',
        dump: (arr, ctx) => arr.map(v => !v.name ? v.dump() : `=?utf-8?B?${ctx.toBase64(v.name)}?= <${v.addr}>`).join(",\n ")
      },
      {
        placement: 'header',
        name: 'Message-ID',
        disabled: false,
        generator: (ctx) => {
          const datestr = Date.now().toString();
          const randomstr = Math.random().toString(36).slice(2);
          const domain = ctx.store.filter(item => item.name == 'From')[0].value.getAddrDomain();
          return '<' + randomstr + '-' + datestr + '@' + domain + '>'
        },
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'header',
        name: 'Subject',
        required: true,
        dump: (v, ctx) => '=?utf-8?B?' + ctx.toBase64(v) + '?='
      },
      {
        placement: 'header',
        name: 'MIME-Version',
        generator: () => '1.0',
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'content',
        name: 'Content-ID',
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'content',
        name: 'Content-Type',
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'content',
        name: 'Content-Transfer-Encoding',
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'content',
        name: 'Content-Disposition',
        dump: (v) => {
          return v
        }
      }
    ];
  }

  set(name, value) {
    for (const item of this.store) {
      if (item.name.toLowerCase() == name.toLowerCase()) {
        item.value = value;
        return item
      }
    }

    const newHeader = {
      custom: true,
      placement: this.placement,
      name: name,
      value: value,
      dump: (v) => {
        return v
      }
    };

    this.store.push(newHeader);

    return newHeader
  }

  get(name) {
    for (const item of this.store) {
      if (item.name.toLowerCase() == name.toLowerCase()) {
        return item.value
      }
    }
    return undefined
  }

  toObject() {
    return this.store.reduce((memo, item) => {
      memo[item.name] = item.value;
      return memo
    }, {})
  }

  dump(envctx) {
    const ctx = {
      toBase64: envctx.toBase64,
      store: this.store
    };

    let lines = '';
    for (const item of this.store) {
      if (item.placement != this.placement) continue;

      const v = item.value
        ? item.value
        : !item.disabled && typeof item.generator == 'function'
          ? item.generator(ctx)
          : null;

      if (!v && item.required) {
        throw new MIMETextError('MISSING_HEADER', `The "${item.name}" header is required.`)
      }

      if (!v) continue;

      lines += `${item.name}: ${item.dump(v, ctx)}\r\n`;
    }

    return lines.slice(0, -2)
  }
}

class MIMEMessageContent {
  constructor(data) {
    this.maxLineLen = 78;
    this.data = data;
    this.headers = new MIMEMessageHeader('content');
  }

  setHeader() {
    this.headers.set(arguments[0], arguments[1]);
    return this
  }

  setHeaders(obj) {
    Object.keys(obj).map(prop => this.setHeader(prop, obj[prop]));
    return this
  }

  getHeaders() {
    return this.headers.toObject()
  }

  getHeader(name) {
    return this.headers.get(name)
  }

  isAttachment() {
    const d = this.headers.get('Content-Disposition');
    return d && d.indexOf('attachment') !== -1 ? true : false;
  }

  dump(envctx, boundaries) {
    const headerBlock = this.headers.dump(envctx);

    if (this.isAttachment()) {
      return `--${boundaries.mixed}
${headerBlock}

${this.data}
`
    }
    else {
      return `${headerBlock}\r\n\r\n${this.data}`
    }
  }
}

class Mailbox {
  constructor(input, opts={type: 'to'}) {
    this.reSpecCompliantAddr = /(([^<>\n\r]+)\s)?<[^\n\r]+>/;

    this.name = null;
    this.addr = null;
    this.type = opts.type || 'to';
    this.input = input;
    this.inputType = this.findInputType(input);

    this.createMailbox();
  }

  findInputType(input) {
    if (Object.prototype.toString.call(input) === '[object Object]') {
      if (!input.addr) {
        throw new MIMETextError('INVALID_MAILBOX', `
          The input should have an "addr" property that specifies the email address \
          of the recipient.
        `)
      }
      return 'OBJECT'
    }
    else if (this.reSpecCompliantAddr.test(input)) {
      return 'SPEC_COMPLIANT_TEXT'
    }
    else if (typeof input == 'string') {
      return 'TEXT'
    }
    else {
      throw new MIMETextError('INVALID_MAILBOX')
    }
  }

  parseSpecCompliantText(text) {
    text = text.trim();

    if (text.slice(0, 1) == '<' && text.slice(-1) == '>') {
      return {addr: text.slice(1, -1)}
    }

    const arr = text.split(' <');
    arr[0] = /^("|')/.test(arr[0]) ? arr[0].slice(1) : arr[0];
    arr[0] = /("|')$/.test(arr[0]) ? arr[0].slice(0, -1) : arr[0];
    arr[1] = arr[1].slice(0, -1);

    return {name: arr[0], addr: arr[1]}
  }

  createMailbox() {
    switch (this.inputType) {
      case 'OBJECT':
        this.addr = this.input.addr;
        this.name = this.input.name || null;
        this.type = this.input.type || this.type;
        break;

      case 'SPEC_COMPLIANT_TEXT':
        const obj = this.parseSpecCompliantText(this.input);
        this.addr = obj.addr;
        this.name = obj.name || null;
        break;

      case 'TEXT':
        this.addr = this.input;
        break;
    }
  }

  getAddrDomain() {
    if (!this.addr) {
      return ''
    }

    return this.addr.split('@')[1]
  }

  dump() {
    let result = `<${this.addr}>`;

    if (this.name) {
      result = `"${this.name}" ${result}`;
    }

    return result
  }

  toObject() {
    return {
      name: this.name,
      addr: this.addr,
      type: this.type
    }
  }
}

class MIMEMessage {
  constructor(envctx) {
    this.envctx = envctx;
    this.headers = new MIMEMessageHeader('header');
    this.messages = [];

    this.generateBoundaries();
  }

  generateBoundaries() {
    this.boundaries = {
      mixed: Math.random().toString(36).slice(2),
      alt: Math.random().toString(36).slice(2)
    };
  }

  setSender(input) {
    const mailbox = new Mailbox(input, {type: 'from'});

    this.setHeader('From', mailbox);

    return mailbox
  }

  getSender() {
    return this.getHeader('From')
  }

  setRecipients(input, opts={type: 'to'}) {
    const recs = [];

    if (Array.isArray(input)) {
      input.map(input => recs.push( new Mailbox(input, opts) ));
    }
    else {
      recs.push( new Mailbox(input, opts) );
    }

    this.setHeader(opts.type, recs);

    return recs
  }

  getRecipients(opts={type: 'to'}) {
    return this.getHeader(opts.type) || []
  }

  setRecipient(input) {
    return this.setRecipients(input, {type: 'to'})
  }

  setTo(input) {
    return this.setRecipients(input, {type: 'to'})
  }

  setCc(input) {
    return this.setRecipients(input, {type: 'cc'})
  }

  setBcc(input) {
    return this.setRecipients(input, {type: 'bcc'})
  }

  setSubject(value) {
    this.setHeader('subject', value);
    return value
  }

  getSubject() {
    return this.getHeader('subject')
  }

  setHeader() {
    this.headers.set(arguments[0], arguments[1]);
    return arguments[0]
  }

  getHeader(name) {
    return this.headers.get(name)
  }

  setHeaders(obj) {
    Object.keys(obj).map(prop => this.setHeader(prop, obj[prop]));
    return this
  }

  getHeaders() {
    return this.headers.toObject()
  }

  setMessage(type, data, moreHeaders={}) {
    const validTypes = ['text/html', 'text/plain'];

    if (validTypes.indexOf(type) === -1) {
      throw new MIMETextError('INVALID_MESSAGE_TYPE', `
        Invalid content type for the message. Supported content types \
        are ${validTypes.join(', ')} but you specified "${type}".
      `)
    }

    const headers = Object.assign({}, moreHeaders, {
      'Content-Type': `${type}; charset=UTF-8`
    });
    const msg = new MIMEMessageContent(data);

    msg.setHeaders(headers);

    this.messages.push(msg);

    return msg
  }

  setAttachment(filename, type, data, moreHeaders={}) {
    const headers = Object.assign({}, moreHeaders, {
      'Content-Type': `${type}; charset=UTF-8`,
      'Content-Transfer-Encoding': 'base64',
      'Content-Disposition': `attachment;filename="${filename}"`
    });
    const msg = new MIMEMessageContent(data);

    msg.setHeaders(headers);

    this.messages.push(msg);

    return this
  }

  getMessageByType(type) {
    const matches = this.messages.filter(m => m.getHeader('Content-Type').indexOf(type) !== -1);
    if (Array.isArray(matches) && matches.length > 0) {
      return matches[0]
    }
    else {
      return undefined
    }
  }

  getAttachments() {
    return this.messages.filter(m => m.isAttachment() === true) || []
  }

  asRaw() {
    let lines = this.headers.dump(this.envctx);

    const plainTextMessage = this.getMessageByType('text/plain');
    const htmlMessage = this.getMessageByType('text/html');
    const hasAttachments = this.getAttachments().length > 0;
    const hasPlainTextAlt = plainTextMessage instanceof MIMEMessageContent && htmlMessage instanceof MIMEMessageContent;

    if (hasAttachments && hasPlainTextAlt) return this.asRawMixedAlt(lines)
    else if (hasAttachments) return this.asRawMixed(lines)
    else if (hasPlainTextAlt) return this.asRawAlt(lines)
    else return this.asRawMessage(lines)
  }

  asEncoded() {
    return this.envctx.toBase64WebSafe( this.asRaw() )
  }

  asRawMessage(lines) {
    const plainTextMessage = this.getMessageByType('text/plain');
    const htmlMessage = this.getMessageByType('text/html');
    const message = htmlMessage || plainTextMessage;

    lines = `${lines}
${message.dump(this.envctx, this.boundaries)}`;

    return lines
  }

  asRawAlt(lines) {
    const plainTextMessage = this.getMessageByType('text/plain');
    const htmlMessage = this.getMessageByType('text/html');

    lines = `${lines}
Content-Type: multipart/alternative; boundary=${this.boundaries.alt}

--${this.boundaries.alt}
${plainTextMessage.dump(this.envctx, this.boundaries)}

--${this.boundaries.alt}
${htmlMessage.dump(this.envctx, this.boundaries)}

--${this.boundaries.alt}--`;

    return lines
  }

  asRawMixed(lines) {
    const plainTextMessage = this.getMessageByType('text/plain');
    const htmlMessage = this.getMessageByType('text/html');
    const message = htmlMessage || plainTextMessage;
    const attachments = this.getAttachments()
      .map(a => a.dump(this.envctx, this.boundaries))
      .join('')
      .replace(/[\r\n]$/g, '');

    lines = `${lines}
Content-Type: multipart/mixed; boundary=${this.boundaries.mixed}

--${this.boundaries.mixed}
${message.dump(this.envctx, this.boundaries)}

${attachments}

--${this.boundaries.mixed}--`;

    return lines
  }

  asRawMixedAlt(lines) {
    const plainTextMessage = this.getMessageByType('text/plain');
    const htmlMessage = this.getMessageByType('text/html');
    const attachments = this.getAttachments()
      .map(a => a.dump(this.envctx, this.boundaries))
      .join('')
      .replace(/[\r\n]$/g, '');

    lines = `${lines}
Content-Type: multipart/mixed; boundary=${this.boundaries.mixed}

--${this.boundaries.mixed}
Content-Type: multipart/alternative; boundary=${this.boundaries.alt}

--${this.boundaries.alt}
${plainTextMessage.dump(this.envctx, this.boundaries)}

--${this.boundaries.alt}
${htmlMessage.dump(this.envctx, this.boundaries)}

--${this.boundaries.alt}--
${attachments}

--${this.boundaries.mixed}--`;

    return lines
  }

  toBase64(v) {
    return this.envctx.toBase64(v)
  }
}

const envctx = {
  toBase64: function toBase64(data) {
    return Buffer.from(data).toString('base64')
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return Buffer.from(data).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
};

class NodeMIMEMessage extends MIMEMessage {
  constructor() {
    super(envctx);
  }
}

function createMimeMessage() {
  return new NodeMIMEMessage()
}

export { createMimeMessage };
//# sourceMappingURL=index.js.map
