import MIMETextError from './MIMETextError.js'

export default class Mailbox {
  constructor(input, opts={type: 'to'}) {
    this.reSpecCompliantAddr = /(([^<>\n\r]+)\s)?<[^\n\r]+>/

    this.name = null
    this.addr = null
    this.type = opts.type || 'to'
    this.input = input
    this.inputType = this.findInputType(input)

    this.createMailbox()
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
    text = text.trim()

    if (text.slice(0, 1) == '<' && text.slice(-1) == '>') {
      return {addr: text.slice(1, -1)}
    }

    const arr = text.split(' <')
    arr[0] = /^("|')/.test(arr[0]) ? arr[0].slice(1) : arr[0]
    arr[0] = /("|')$/.test(arr[0]) ? arr[0].slice(0, -1) : arr[0]
    arr[1] = arr[1].slice(0, -1)

    return {name: arr[0], addr: arr[1]}
  }

  createMailbox() {
    switch (this.inputType) {
      case 'OBJECT':
        this.addr = this.input.addr
        this.name = this.input.name || null
        this.type = this.input.type || this.type
        break;

      case 'SPEC_COMPLIANT_TEXT':
        const obj = this.parseSpecCompliantText(this.input)
        this.addr = obj.addr
        this.name = obj.name || null
        break;

      case 'TEXT':
        this.addr = this.input
        break;

      default:
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
    let result = `<${this.addr}>`

    if (this.name) {
      result = `"${this.name}" ${result}`
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
