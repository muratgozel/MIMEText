import { EOL } from 'node:os';
import * as mime from 'mime-types';

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => {
  __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MIMETextError extends Error {
  constructor(message, description = "") {
    super(description);
    __publicField$4(this, "name", "");
    __publicField$4(this, "description", "");
    this.name = message;
    this.description = description;
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => {
  __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Mailbox {
  constructor(input, config = { type: "To" }) {
    __publicField$3(this, "reSpecCompliantAddr", /(([^<>\r\n]+)\s)?<[^\r\n]+>/);
    __publicField$3(this, "name", "");
    __publicField$3(this, "addr", "");
    __publicField$3(this, "type", "To");
    this.type = config.type;
    this.parse(input);
  }
  getAddrDomain() {
    if (this.addr.includes("@")) {
      const arr = this.addr.split("@");
      if (arr.length > 1)
        return arr[1];
    }
    return "";
  }
  dump() {
    return this.name.length > 0 ? `"${this.name}" <${this.addr}>` : `<${this.addr}>`;
  }
  parse(input) {
    if (this.isMailboxAddrObject(input)) {
      this.addr = input.addr;
      if (typeof input.name === "string")
        this.name = input.name;
      if (typeof input.type === "string")
        this.type = input.type;
      return this;
    }
    if (this.isMailboxAddrText(input)) {
      const text = input.trim();
      if (text.slice(0, 1) === "<" && text.slice(-1) === ">") {
        this.addr = text.slice(1, -1);
        return this;
      }
      const arr = text.split(" <");
      arr[0] = /^("|')/.test(arr[0]) ? arr[0].slice(1) : arr[0];
      arr[0] = /("|')$/.test(arr[0]) ? arr[0].slice(0, -1) : arr[0];
      arr[1] = arr[1].slice(0, -1);
      this.name = arr[0];
      this.addr = arr[1];
      return this;
    }
    if (typeof input === "string") {
      this.addr = input;
      return this;
    }
    throw new MIMETextError("MIMETEXT_INVALID_MAILBOX", "Couldn't recognize the input.");
  }
  isMailboxAddrText(v) {
    return typeof v === "string" && this.reSpecCompliantAddr.test(v);
  }
  isMailboxAddrObject(v) {
    return this.isObject(v) && Object.hasOwn(v, "addr");
  }
  isObject(v) {
    return !!v && v.constructor === Object;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MIMEMessageHeader {
  constructor(envctx) {
    __publicField$2(this, "envctx");
    __publicField$2(this, "fields", [
      {
        name: "Date",
        generator: () => (/* @__PURE__ */ new Date()).toUTCString().replace(/GMT|UTC/gi, "+0000")
      },
      {
        name: "From",
        required: true,
        validate: (v) => this.validateMailboxSingle(v),
        dump: (v) => this.dumpMailboxSingle(v)
      },
      {
        name: "Sender",
        validate: (v) => this.validateMailboxSingle(v),
        dump: (v) => this.dumpMailboxSingle(v)
      },
      {
        name: "Reply-To",
        validate: (v) => this.validateMailboxSingle(v),
        dump: (v) => this.dumpMailboxSingle(v)
      },
      {
        name: "To",
        validate: (v) => this.validateMailboxMulti(v),
        dump: (v) => this.dumpMailboxMulti(v)
      },
      {
        name: "Cc",
        validate: (v) => this.validateMailboxMulti(v),
        dump: (v) => this.dumpMailboxMulti(v)
      },
      {
        name: "Bcc",
        validate: (v) => this.validateMailboxMulti(v),
        dump: (v) => this.dumpMailboxMulti(v)
      },
      {
        name: "Message-ID",
        generator: () => {
          const randomstr = Math.random().toString(36).slice(2);
          const from = this.fields.filter((obj) => obj.name === "From")[0].value;
          const domain = from.getAddrDomain();
          return "<" + randomstr + "@" + domain + ">";
        }
      },
      {
        name: "Subject",
        required: true,
        dump: (v) => {
          return typeof v === "string" ? "=?utf-8?B?" + this.envctx.toBase64(v) + "?=" : "";
        }
      },
      {
        name: "MIME-Version",
        generator: () => "1.0"
      }
    ]);
    this.envctx = envctx;
  }
  dump() {
    let lines = "";
    for (const field of this.fields) {
      if (field.disabled)
        continue;
      const isValueDefinedByUser = field.value !== void 0 && field.value !== null;
      if (!isValueDefinedByUser && field.required) {
        throw new MIMETextError("MIMETEXT_MISSING_HEADER", `The "${field.name}" header is required.`);
      }
      if (!isValueDefinedByUser && typeof field.generator !== "function")
        continue;
      if (!isValueDefinedByUser && typeof field.generator === "function")
        field.value = field.generator();
      const strval = Object.hasOwn(field, "dump") && typeof field.dump === "function" ? field.dump(field.value) : typeof field.value === "string" ? field.value : "";
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
    return ind !== -1 ? this.fields[ind].value : void 0;
  }
  set(name, value) {
    const fieldMatcher = (obj) => obj.name.toLowerCase() === name.toLowerCase();
    const isCustomHeader = !this.fields.some(fieldMatcher);
    if (!isCustomHeader) {
      const ind = this.fields.findIndex(fieldMatcher);
      const field = this.fields[ind];
      if (field.validate && !field.validate(value)) {
        throw new MIMETextError("MIMETEXT_INVALID_HEADER_VALUE", `The value for the header "${name}" is invalid.`);
      }
      this.fields[ind].value = value;
      return this.fields[ind];
    }
    return this.setCustom({
      name,
      value,
      custom: true,
      dump: (v) => typeof v === "string" ? v : ""
    });
  }
  setCustom(obj) {
    if (this.isHeaderField(obj)) {
      if (typeof obj.value !== "string") {
        throw new MIMETextError("MIMETEXT_INVALID_HEADER_FIELD", "Custom header must have a value.");
      }
      this.fields.push(obj);
      return obj;
    }
    throw new MIMETextError("MIMETEXT_INVALID_HEADER_FIELD", "Invalid input for custom header. It must be in type of HeaderField.");
  }
  validateMailboxSingle(v) {
    return v instanceof Mailbox;
  }
  validateMailboxMulti(v) {
    return v instanceof Mailbox || this.isArrayOfMailboxes(v);
  }
  dumpMailboxMulti(v) {
    const dump = (item) => item.name.length === 0 ? item.dump() : `=?utf-8?B?${this.envctx.toBase64(item.name)}?= <${item.addr}>`;
    return this.isArrayOfMailboxes(v) ? v.map(dump).join(`,${this.envctx.eol} `) : v instanceof Mailbox ? dump(v) : "";
  }
  dumpMailboxSingle(v) {
    const dump = (item) => item.name.length === 0 ? item.dump() : `=?utf-8?B?${this.envctx.toBase64(item.name)}?= <${item.addr}>`;
    return v instanceof Mailbox ? dump(v) : "";
  }
  isHeaderField(v) {
    const validProps = ["name", "value", "dump", "required", "disabled", "generator", "custom"];
    if (this.isObject(v)) {
      const h = v;
      if (Object.hasOwn(h, "name") && typeof h.name === "string" && h.name.length > 0) {
        if (!Object.keys(h).some((prop) => !validProps.includes(prop))) {
          return true;
        }
      }
    }
    return false;
  }
  isObject(v) {
    return !!v && v.constructor === Object;
  }
  isArrayOfMailboxes(v) {
    return this.isArray(v) && v.every((item) => item instanceof Mailbox);
  }
  isArray(v) {
    return !!v && v.constructor === Array;
  }
}
class MIMEMessageContentHeader extends MIMEMessageHeader {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(envctx) {
    super(envctx);
    __publicField$2(this, "fields", [
      {
        name: "Content-ID"
      },
      {
        name: "Content-Type"
      },
      {
        name: "Content-Transfer-Encoding"
      },
      {
        name: "Content-Disposition"
      }
    ]);
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MIMEMessageContent {
  constructor(envctx, data, headers = {}) {
    __publicField$1(this, "envctx");
    __publicField$1(this, "headers");
    __publicField$1(this, "data");
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
    const disposition = this.headers.get("Content-Disposition");
    return typeof disposition === "string" && disposition.includes("attachment");
  }
  isInlineAttachment() {
    const disposition = this.headers.get("Content-Disposition");
    return typeof disposition === "string" && disposition.includes("inline");
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MIMEMessage {
  constructor(envctx) {
    __publicField(this, "envctx");
    __publicField(this, "headers");
    __publicField(this, "boundaries", { mixed: "", alt: "", related: "" });
    __publicField(this, "validTypes", ["text/html", "text/plain"]);
    __publicField(this, "validContentTransferEncodings", ["7bit", "8bit", "binary", "quoted-printable", "base64"]);
    __publicField(this, "messages", []);
    this.envctx = envctx;
    this.headers = new MIMEMessageHeader(this.envctx);
    this.messages = [];
    this.generateBoundaries();
  }
  asRaw() {
    const eol = this.envctx.eol;
    const lines = this.headers.dump();
    const plaintext = this.getMessageByType("text/plain");
    const html = this.getMessageByType("text/html");
    const primaryMessage = html ?? (plaintext ?? void 0);
    if (primaryMessage === void 0) {
      throw new MIMETextError("MIMETEXT_MISSING_BODY", "No content added to the message.");
    }
    const hasAttachments = this.hasAttachments();
    const hasInlineAttachments = this.hasInlineAttachments();
    const structure = hasInlineAttachments && hasAttachments ? "mixed+related" : hasAttachments ? "mixed" : hasInlineAttachments ? "related" : plaintext && html ? "alternative" : "";
    if (structure === "mixed+related") {
      const attachments = this.getAttachments().map((a) => "--" + this.boundaries.mixed + eol + a.dump() + eol + eol).join("").slice(0, -1 * eol.length);
      const inlineAttachments = this.getInlineAttachments().map((a) => "--" + this.boundaries.related + eol + a.dump() + eol + eol).join("").slice(0, -1 * eol.length);
      return lines + eol + "Content-Type: multipart/mixed; boundary=" + this.boundaries.mixed + eol + eol + "--" + this.boundaries.mixed + eol + "Content-Type: multipart/related; boundary=" + this.boundaries.related + eol + eol + this.dumpTextContent(plaintext, html, this.boundaries.related) + eol + eol + inlineAttachments + "--" + this.boundaries.related + "--" + eol + attachments + "--" + this.boundaries.mixed + "--";
    } else if (structure === "mixed") {
      const attachments = this.getAttachments().map((a) => "--" + this.boundaries.mixed + eol + a.dump() + eol + eol).join("").slice(0, -1 * eol.length);
      return lines + eol + "Content-Type: multipart/mixed; boundary=" + this.boundaries.mixed + eol + eol + this.dumpTextContent(plaintext, html, this.boundaries.mixed) + eol + (plaintext && html ? "" : eol) + attachments + "--" + this.boundaries.mixed + "--";
    } else if (structure === "related") {
      const inlineAttachments = this.getInlineAttachments().map((a) => "--" + this.boundaries.related + eol + a.dump() + eol + eol).join("").slice(0, -1 * eol.length);
      return lines + eol + "Content-Type: multipart/related; boundary=" + this.boundaries.related + eol + eol + this.dumpTextContent(plaintext, html, this.boundaries.related) + eol + eol + inlineAttachments + "--" + this.boundaries.related + "--";
    } else if (structure === "alternative") {
      return lines + eol + "Content-Type: multipart/alternative; boundary=" + this.boundaries.alt + eol + eol + this.dumpTextContent(plaintext, html, this.boundaries.alt) + eol + eol + "--" + this.boundaries.alt + "--";
    } else {
      return lines + eol + primaryMessage.dump();
    }
  }
  asEncoded() {
    return this.envctx.toBase64WebSafe(this.asRaw());
  }
  dumpTextContent(plaintext, html, boundary) {
    const eol = this.envctx.eol;
    const primaryMessage = html ?? plaintext;
    let data = "";
    if (plaintext && html && !this.hasInlineAttachments() && this.hasAttachments()) {
      data = "--" + boundary + eol + "Content-Type: multipart/alternative; boundary=" + this.boundaries.alt + eol + eol + "--" + this.boundaries.alt + eol + plaintext.dump() + eol + eol + "--" + this.boundaries.alt + eol + html.dump() + eol + eol + "--" + this.boundaries.alt + "--";
    } else if (plaintext && html && this.hasInlineAttachments()) {
      data = "--" + boundary + eol + html.dump();
    } else if (plaintext && html) {
      data = "--" + boundary + eol + plaintext.dump() + eol + eol + "--" + boundary + eol + html.dump();
    } else {
      data = "--" + boundary + eol + primaryMessage.dump();
    }
    return data;
  }
  hasInlineAttachments() {
    return this.messages.some((msg) => msg.isInlineAttachment());
  }
  hasAttachments() {
    return this.messages.some((msg) => msg.isAttachment());
  }
  getAttachments() {
    const matcher = (msg) => msg.isAttachment();
    return this.messages.some(matcher) ? this.messages.filter(matcher) : [];
  }
  getInlineAttachments() {
    const matcher = (msg) => msg.isInlineAttachment();
    return this.messages.some(matcher) ? this.messages.filter(matcher) : [];
  }
  getMessageByType(type) {
    const matcher = (msg) => !msg.isAttachment() && !msg.isInlineAttachment() && (msg.getHeader("Content-Type") || "").includes(type);
    return this.messages.some(matcher) ? this.messages.filter(matcher)[0] : void 0;
  }
  addAttachment(opts) {
    if (!this.isObject(opts.headers))
      opts.headers = {};
    if (typeof opts.filename !== "string") {
      throw new MIMETextError("MIMETEXT_MISSING_FILENAME", 'The property "filename" must exist while adding attachments.');
    }
    let type = (opts.headers["Content-Type"] ?? opts.contentType) || "none";
    if (this.envctx.validateContentType(type) === false) {
      throw new MIMETextError("MIMETEXT_INVALID_MESSAGE_TYPE", `You specified an invalid content type "${type}".`);
    }
    const encoding = opts.headers["Content-Transfer-Encoding"] ?? opts.encoding ?? "base64";
    if (!this.validContentTransferEncodings.includes(encoding)) {
      type = "application/octet-stream";
    }
    const contentId = opts.headers["Content-ID"];
    if (typeof contentId === "string" && contentId.length > 2 && contentId.slice(0, 1) !== "<" && contentId.slice(-1) !== ">") {
      opts.headers["Content-ID"] = "<" + opts.headers["Content-ID"] + ">";
    }
    const disposition = opts.inline ? "inline" : "attachment";
    opts.headers = Object.assign({}, opts.headers, {
      "Content-Type": `${type}; name="${opts.filename}"`,
      "Content-Transfer-Encoding": encoding,
      "Content-Disposition": `${disposition}; filename="${opts.filename}"`
    });
    return this._addMessage({ data: opts.data, headers: opts.headers });
  }
  addMessage(opts) {
    if (!this.isObject(opts.headers))
      opts.headers = {};
    let type = (opts.headers["Content-Type"] ?? opts.contentType) || "none";
    if (!this.validTypes.includes(type)) {
      throw new MIMETextError("MIMETEXT_INVALID_MESSAGE_TYPE", `Valid content types are ${this.validTypes.join(", ")} but you specified "${type}".`);
    }
    const encoding = opts.headers["Content-Transfer-Encoding"] ?? opts.encoding ?? "7bit";
    if (!this.validContentTransferEncodings.includes(encoding)) {
      type = "application/octet-stream";
    }
    const charset = opts.charset ?? "UTF-8";
    opts.headers = Object.assign({}, opts.headers, {
      "Content-Type": `${type}; charset=${charset}`,
      "Content-Transfer-Encoding": encoding
    });
    return this._addMessage({ data: opts.data, headers: opts.headers });
  }
  _addMessage(opts) {
    const msg = new MIMEMessageContent(this.envctx, opts.data, opts.headers);
    this.messages.push(msg);
    return msg;
  }
  setSender(input, config = { type: "From" }) {
    const mailbox = new Mailbox(input, config);
    this.setHeader("From", mailbox);
    return mailbox;
  }
  getSender() {
    return this.getHeader("From");
  }
  setRecipients(input, config = { type: "To" }) {
    const arr = !this.isArray(input) ? [input] : input;
    const recs = arr.map((_input) => new Mailbox(_input, config));
    this.setHeader(config.type, recs);
    return recs;
  }
  getRecipients(config = { type: "To" }) {
    return this.getHeader(config.type);
  }
  setRecipient(input, config = { type: "To" }) {
    return this.setRecipients(input, config);
  }
  setTo(input, config = { type: "To" }) {
    return this.setRecipients(input, config);
  }
  setCc(input, config = { type: "Cc" }) {
    return this.setRecipients(input, config);
  }
  setBcc(input, config = { type: "Bcc" }) {
    return this.setRecipients(input, config);
  }
  setSubject(value) {
    this.setHeader("subject", value);
    return value;
  }
  getSubject() {
    return this.getHeader("subject");
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
  toBase64(v) {
    return this.envctx.toBase64(v);
  }
  toBase64WebSafe(v) {
    return this.envctx.toBase64WebSafe(v);
  }
  generateBoundaries() {
    this.boundaries = {
      mixed: Math.random().toString(36).slice(2),
      alt: Math.random().toString(36).slice(2),
      related: Math.random().toString(36).slice(2)
    };
  }
  isArray(v) {
    return !!v && v.constructor === Array;
  }
  isObject(v) {
    return !!v && v.constructor === Object;
  }
}

const envctx = {
  toBase64: function toBase64(data) {
    return Buffer.from(data).toString("base64");
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return Buffer.from(data).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  },
  eol: EOL,
  validateContentType: (v) => {
    return mime.contentType(v);
  }
};
function createMimeMessage() {
  return new MIMEMessage(envctx);
}

export { MIMEMessage, MIMEMessageContent, MIMEMessageHeader, MIMETextError, Mailbox, createMimeMessage };
