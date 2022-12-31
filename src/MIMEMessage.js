import MIMEMessageHeader from './MIMEMessageHeader.js'
import MIMEMessageContent from './MIMEMessageContent.js'
import MIMETextError from './MIMETextError.js'
import Mailbox from './Mailbox.js'

export default class MIMEMessage {
  constructor(envctx) {
    this.envctx = envctx
    this.headers = new MIMEMessageHeader('header')
    this.messages = []

    this.generateBoundaries()
  }

  generateBoundaries() {
    this.boundaries = {
      mixed: Math.random().toString(36).slice(2),
      alt: Math.random().toString(36).slice(2)
    }
  }

  setSender(input) {
    const mailbox = new Mailbox(input, {type: 'from'})

    this.setHeader('From', mailbox)

    return mailbox
  }

  getSender() {
    return this.getHeader('From')
  }

  setRecipients(input, opts={type: 'to'}) {
    const recs = []

    if (Array.isArray(input)) {
      input.map(input => recs.push( new Mailbox(input, opts) ))
    }
    else {
      recs.push( new Mailbox(input, opts) )
    }

    this.setHeader(opts.type, recs)

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
    this.setHeader('subject', value)
    return value
  }

  getSubject() {
    return this.getHeader('subject')
  }

  setHeader() {
    this.headers.set(arguments[0], arguments[1])
    return arguments[0]
  }

  getHeader(name) {
    return this.headers.get(name)
  }

  setHeaders(obj) {
    Object.keys(obj).map(prop => this.setHeader(prop, obj[prop]))
    return this
  }

  getHeaders() {
    return this.headers.toObject()
  }

  setMessage(type, data, moreHeaders={}) {
    const validTypes = ['text/html', 'text/plain']

    if (validTypes.indexOf(type) === -1) {
      throw new MIMETextError('INVALID_MESSAGE_TYPE', `
        Invalid content type for the message. Supported content types \
        are ${validTypes.join(', ')} but you specified "${type}".
      `)
    }

    const headers = Object.assign({}, moreHeaders, {
      'Content-Type': `${type}; charset=UTF-8`
    })
    const msg = new MIMEMessageContent(data)

    msg.setHeaders(headers)

    this.messages.push(msg)

    return msg
  }

  setAttachment(filename, type, data, moreHeaders={}) {
    const headers = Object.assign({}, moreHeaders, {
      'Content-Type': `${type}; charset=UTF-8`,
      'Content-Transfer-Encoding': 'base64',
      'Content-Disposition': `attachment;filename="${filename}"`
    })
    const msg = new MIMEMessageContent(data)

    msg.setHeaders(headers)

    this.messages.push(msg)

    return this
  }

  getMessageByType(type) {
    const matches = this.messages.filter(m => m.getHeader('Content-Type').indexOf(type) !== -1)
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
    let lines = this.headers.dump(this.envctx)

    const plainTextMessage = this.getMessageByType('text/plain')
    const htmlMessage = this.getMessageByType('text/html')
    const hasAttachments = this.getAttachments().length > 0
    const hasPlainTextAlt = plainTextMessage instanceof MIMEMessageContent && htmlMessage instanceof MIMEMessageContent

    if (hasAttachments && hasPlainTextAlt) return this.asRawMixedAlt(lines)
    else if (hasAttachments) return this.asRawMixed(lines)
    else if (hasPlainTextAlt) return this.asRawAlt(lines)
    else return this.asRawMessage(lines)
  }

  asEncoded() {
    return this.envctx.toBase64WebSafe( this.asRaw() )
  }

  asRawMessage(lines) {
    const plainTextMessage = this.getMessageByType('text/plain')
    const htmlMessage = this.getMessageByType('text/html')
    const message = htmlMessage || plainTextMessage

    lines = `${lines}
${message.dump(this.envctx, this.boundaries)}`

    return lines
  }

  asRawAlt(lines) {
    const plainTextMessage = this.getMessageByType('text/plain')
    const htmlMessage = this.getMessageByType('text/html')

    lines = `${lines}
Content-Type: multipart/alternative; boundary=${this.boundaries.alt}

--${this.boundaries.alt}
${plainTextMessage.dump(this.envctx, this.boundaries)}

--${this.boundaries.alt}
${htmlMessage.dump(this.envctx, this.boundaries)}

--${this.boundaries.alt}--`

    return lines
  }

  asRawMixed(lines) {
    const plainTextMessage = this.getMessageByType('text/plain')
    const htmlMessage = this.getMessageByType('text/html')
    const message = htmlMessage || plainTextMessage
    const attachments = this.getAttachments()
      .map(a => a.dump(this.envctx, this.boundaries))
      .join('')
      .replace(/[\r\n]$/g, '')

    lines = `${lines}
Content-Type: multipart/mixed; boundary=${this.boundaries.mixed}

--${this.boundaries.mixed}
${message.dump(this.envctx, this.boundaries)}

${attachments}

--${this.boundaries.mixed}--`

    return lines
  }

  asRawMixedAlt(lines) {
    const plainTextMessage = this.getMessageByType('text/plain')
    const htmlMessage = this.getMessageByType('text/html')
    const attachments = this.getAttachments()
      .map(a => a.dump(this.envctx, this.boundaries))
      .join('')
      .replace(/[\r\n]$/g, '')

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

--${this.boundaries.mixed}--`

    return lines
  }

  toBase64(v) {
    return this.envctx.toBase64(v)
  }
}
