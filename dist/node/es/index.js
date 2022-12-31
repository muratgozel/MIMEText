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
    this.validateLength(name, value);

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

  validateLength(name, value) {
    const len = name.length + value.length + 2; // 2 is ": "
    if (len > this.maxLineLength) {
      throw new MIMETextError('INVALID_HEADER', `The "${item.name}" header is too long. `
        `${this.maxLineLength} chars allowed at max, "${item.name}" was ${len} long.`)
    }
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

// Current version.

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
(typeof self == 'object' && self.self === self && self) ||
          (typeof global == 'object' && global.global === global && global) ||
          Function('return this')() ||
          {};

// Save bytes in the minified (but not gzipped) version:
var ArrayProto = Array.prototype;

// Create quick reference variables for speed access to core prototypes.
var slice = ArrayProto.slice;

// Chunk a single array into multiple arrays, each containing `count` or fewer
// items.
function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result = [];
  var i = 0, length = array.length;
  while (i < length) {
    result.push(slice.call(array, i, i += count));
  }
  return result;
}

var runesExports = {};
var runes$1 = {
  get exports(){ return runesExports; },
  set exports(v){ runesExports = v; },
};

const HIGH_SURROGATE_START = 0xd800;
const HIGH_SURROGATE_END = 0xdbff;

const LOW_SURROGATE_START = 0xdc00;

const REGIONAL_INDICATOR_START = 0x1f1e6;
const REGIONAL_INDICATOR_END = 0x1f1ff;

const FITZPATRICK_MODIFIER_START = 0x1f3fb;
const FITZPATRICK_MODIFIER_END = 0x1f3ff;

const VARIATION_MODIFIER_START = 0xfe00;
const VARIATION_MODIFIER_END = 0xfe0f;

const DIACRITICAL_MARKS_START = 0x20d0;
const DIACRITICAL_MARKS_END = 0x20ff;

const ZWJ = 0x200d;

const GRAPHEMS = [
  0x0308, // ( ◌̈ ) COMBINING DIAERESIS
  0x0937, // ( ष ) DEVANAGARI LETTER SSA
  0x0937, // ( ष ) DEVANAGARI LETTER SSA
  0x093F, // ( ि ) DEVANAGARI VOWEL SIGN I
  0x093F, // ( ि ) DEVANAGARI VOWEL SIGN I
  0x0BA8, // ( ந ) TAMIL LETTER NA
  0x0BBF, // ( ி ) TAMIL VOWEL SIGN I
  0x0BCD, // ( ◌்) TAMIL SIGN VIRAMA
  0x0E31, // ( ◌ั ) THAI CHARACTER MAI HAN-AKAT
  0x0E33, // ( ำ ) THAI CHARACTER SARA AM
  0x0E40, // ( เ ) THAI CHARACTER SARA E
  0x0E49, // ( เ ) THAI CHARACTER MAI THO
  0x1100, // ( ᄀ ) HANGUL CHOSEONG KIYEOK
  0x1161, // ( ᅡ ) HANGUL JUNGSEONG A
  0x11A8 // ( ᆨ ) HANGUL JONGSEONG KIYEOK
];

function runes (string) {
  if (typeof string !== 'string') {
    throw new Error('string cannot be undefined or null')
  }
  const result = [];
  let i = 0;
  let increment = 0;
  while (i < string.length) {
    increment += nextUnits(i + increment, string);
    if (isGraphem(string[i + increment])) {
      increment++;
    }
    if (isVariationSelector(string[i + increment])) {
      increment++;
    }
    if (isDiacriticalMark(string[i + increment])) {
      increment++;
    }
    if (isZeroWidthJoiner(string[i + increment])) {
      increment++;
      continue
    }
    result.push(string.substring(i, i + increment));
    i += increment;
    increment = 0;
  }
  return result
}

// Decide how many code units make up the current character.
// BMP characters: 1 code unit
// Non-BMP characters (represented by surrogate pairs): 2 code units
// Emoji with skin-tone modifiers: 4 code units (2 code points)
// Country flags: 4 code units (2 code points)
// Variations: 2 code units
function nextUnits (i, string) {
  const current = string[i];
  // If we don't have a value that is part of a surrogate pair, or we're at
  // the end, only take the value at i
  if (!isFirstOfSurrogatePair(current) || i === string.length - 1) {
    return 1
  }

  const currentPair = current + string[i + 1];
  let nextPair = string.substring(i + 2, i + 5);

  // Country flags are comprised of two regional indicator symbols,
  // each represented by a surrogate pair.
  // See http://emojipedia.org/flags/
  // If both pairs are regional indicator symbols, take 4
  if (isRegionalIndicator(currentPair) && isRegionalIndicator(nextPair)) {
    return 4
  }

  // If the next pair make a Fitzpatrick skin tone
  // modifier, take 4
  // See http://emojipedia.org/modifiers/
  // Technically, only some code points are meant to be
  // combined with the skin tone modifiers. This function
  // does not check the current pair to see if it is
  // one of them.
  if (isFitzpatrickModifier(nextPair)) {
    return 4
  }
  return 2
}

function isFirstOfSurrogatePair (string) {
  return string && betweenInclusive(string[0].charCodeAt(0), HIGH_SURROGATE_START, HIGH_SURROGATE_END)
}

function isRegionalIndicator (string) {
  return betweenInclusive(codePointFromSurrogatePair(string), REGIONAL_INDICATOR_START, REGIONAL_INDICATOR_END)
}

function isFitzpatrickModifier (string) {
  return betweenInclusive(codePointFromSurrogatePair(string), FITZPATRICK_MODIFIER_START, FITZPATRICK_MODIFIER_END)
}

function isVariationSelector (string) {
  return typeof string === 'string' && betweenInclusive(string.charCodeAt(0), VARIATION_MODIFIER_START, VARIATION_MODIFIER_END)
}

function isDiacriticalMark (string) {
  return typeof string === 'string' && betweenInclusive(string.charCodeAt(0), DIACRITICAL_MARKS_START, DIACRITICAL_MARKS_END)
}

function isGraphem (string) {
  return typeof string === 'string' && GRAPHEMS.indexOf(string.charCodeAt(0)) !== -1
}

function isZeroWidthJoiner (string) {
  return typeof string === 'string' && string.charCodeAt(0) === ZWJ
}

function codePointFromSurrogatePair (pair) {
  const highOffset = pair.charCodeAt(0) - HIGH_SURROGATE_START;
  const lowOffset = pair.charCodeAt(1) - LOW_SURROGATE_START;
  return (highOffset << 10) + lowOffset + 0x10000
}

function betweenInclusive (value, lower, upper) {
  return value >= lower && value <= upper
}

function substring (string, start, width) {
  const chars = runes(string);
  if (start === undefined) {
    return string
  }
  if (start >= chars.length) {
    return ''
  }
  const rest = chars.length - start;
  const stringWidth = width === undefined ? rest : width;
  let endIndex = start + stringWidth;
  if (endIndex > (start + rest)) {
    endIndex = undefined;
  }
  return chars.slice(start, endIndex).join('')
}

runes$1.exports = runes;
runesExports.substr = substring;

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

  configureLineLength(text) {
    return text.split(/[\r\n]+/).map(line => !line ? '' : chunk(runesExports(line), this.maxLineLen).map(arr => arr.join('')).join("\r\n")).join("\r\n")
  }

  dump(envctx, boundaries) {
    const headerBlock = this.headers.dump(envctx);

    if (this.isAttachment()) {
      return `--${boundaries.mixed}
${headerBlock}

${this.configureLineLength(this.data)}
`
    }
    else {
      return `${headerBlock}\r\n\r\n${this.configureLineLength(this.data)}`
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
