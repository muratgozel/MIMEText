const {typekit, objectkit, validationkit} = require('basekits');
const isGas = 'undefined' !== typeof ScriptApp;

function MIMEMessage() {
  const memory = {
    senders: null,
    recipients: null,
    cc: null,
    bcc: null,
    subject: null,
    encodedSubject: null,
    rawMessage: null,
    message: null,
    rawHTML: null,
    html: null,
    attachments: null,
    headers: null,
    boundaryNumber: 0,
    boundaryMixed: null,
    boundaryAlt: null,
    timestamp: Date.now()
  }

  function setRecipient(inputs, opts={}) {
    const mailboxes = createMailboxes(inputs)

    if (validationkit.isEmpty(mailboxes)) {
      return undefined
    }

    if (opts.cc) {
      memory.cc = mailboxes
    }
    else if (opts.bcc) {
      memory.bcc = mailboxes
    }
    else {
      memory.recipients = mailboxes
    }

    return mailboxes
  }

  function setSender(inputs) {
    const mailboxes = createMailboxes(inputs)

    if (validationkit.isEmpty(mailboxes)) {
      return undefined
    }

    memory.senders = mailboxes

    return memory.senders
  }

  function setSubject(value) {
    if (validationkit.isEmpty(value) || !typekit.isString(value)) {
      return undefined
    }

    memory.subject = value
    memory.encodedSubject = '=?utf-8?B?' + toBase64(value) + '?='

    return memory.subject
  }

  function setMessage(msg, type=undefined) {
    if (!typekit.isString(msg)) {
      return undefined
    }

    const msgtype = typeof type == 'string' && ['text/html', 'text/plain'].indexOf(type) !== -1
      ? type
      : guessMessageType(msg)
    const rawProp = msgtype == 'text/html' ? 'rawHTML' : 'rawMessage'
    const prop = msgtype == 'text/html' ? 'html' : 'message'

    memory[rawProp] = msg
    memory[prop] = [
      'Content-Type: ' + msgtype + '; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      toBase64(msg)
    ].join('\r\n')

    if (memory.message && memory.html) {
      memory.boundaryAlt = genNewBoundary()
    }

    return memory[rawProp]
  }

  function toGasAttachments(attachments) {
    if(!isGas) return attachments
    const isArray = Array.isArray(attachments)
    const toAttachmentObject = file => ({
      type: file.getMimeType(),
      filename: file.getName(),
      base64Data: Utilities.base64Encode(file.getBlob().getBytes()),
    })
    if(!isArray) return toAttachmentObject(attachments)
    return attachments.map(toAttachmentObject)
  };

  function setAttachments(attachments) {
    if (validationkit.isEmpty(attachments)) {
      return undefined
    }

    attachments = toGasAttachments(attachments)

    memory.boundaryMixed = genNewBoundary()

    const lines = []
    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments[i]

      const type = objectkit.getProp(attachment, 'type')
      const filename = objectkit.getProp(attachment, 'filename')
      const base64Data = objectkit.getProp(attachment, 'base64Data')
      const contentId = objectkit.getProp(attachment, 'contentId')

      if (!validationkit.isEmpty(type) && !validationkit.isEmpty(base64Data)) {
        lines.push('--' + memory.boundaryMixed)
        lines.push('Content-Type: ' + attachment.type)
        lines.push('Content-Transfer-Encoding: base64')

        if (contentId) {
          lines.push('Content-Id: <' + contentId + '>')
        }

        if (filename) {
          lines.push('Content-Disposition: attachment;filename="' + filename + '"')
        }

        lines.push('')
        lines.push(attachment.base64Data)
        lines.push('')
      }
    }

    if (!validationkit.isEmpty(lines)) {
      memory.attachments = lines.join('\r\n').replace(/[\r\n]$/g, '')
    }

    return memory.attachments
  }

  function setHeaders(headers) {
    if (validationkit.isEmpty(headers)) {
      return undefined
    }

    const lines = []
    for (key in headers) {
      const value = objectkit.getProp(headers, key)
      lines.push(key + ": " + value)
    }

    memory.headers = lines.join('\r\n')
  }

  function asRaw() {
    let lines = []

    lines.push('From: ' + createMailboxStr(memory.senders))
    lines.push('To: ' + createMailboxStr(memory.recipients))

    if (memory.cc) {
      lines.push('Cc: ' + createMailboxStr(memory.cc))
    }

    if (memory.bcc) {
      lines.push('Bcc: ' + createMailboxStr(memory.bcc))
    }

    lines.push('Subject: ' + memory.encodedSubject)
    lines.push('MIME-Version: 1.0')
    lines.push('Date: ' + createDateStr())
    lines.push('Message-ID: ' + createMsgID())

    if (memory.headers) {
      lines.push(memory.headers)
    }

    const hasAttachments = !validationkit.isEmpty(memory.attachments)
    const multiContent = memory.message && memory.html

    if (hasAttachments && multiContent) {
      return asRawMixedAlt(lines)
    }
    else if (hasAttachments) {
      return asRawMixed(lines)
    }
    else if (multiContent) {
      return asRawAlt(lines)
    }
    else {
      return asRawMessage(lines)
    }
  }

  function asRawMixedAlt(lines) {
    lines.push('Content-Type: multipart/mixed; boundary=' + memory.boundaryMixed)
    lines.push('')

    lines.push('--' + memory.boundaryMixed)
    lines.push('Content-Type: multipart/alternative; boundary=' + memory.boundaryAlt)
    lines.push('')

    lines.push('--' + memory.boundaryAlt)
    lines.push(getMessage())
    lines.push('')

    lines.push('--' + memory.boundaryAlt)
    lines.push(getHTML())
    lines.push('')

    lines.push('--' + memory.boundaryAlt + '--')

    lines.push(getAttachments())
    lines.push('')

    lines.push('--' + memory.boundaryMixed + '--')

    return lines.join('\r\n') + '\r\n'
  }

  function asRawMixed(lines) {
    lines.push('Content-Type: multipart/mixed; boundary=' + memory.boundaryMixed)
    lines.push('')

    lines.push('--' + memory.boundaryMixed)
    lines.push(getMessage())
    lines.push('')

    lines.push(getAttachments())
    lines.push('')

    lines.push('--' + memory.boundaryMixed + '--')

    return lines.join('\r\n') + '\r\n'
  }

  function asRawAlt(lines) {
    lines.push('Content-Type: multipart/alternative; boundary=' + memory.boundaryAlt)
    lines.push('')

    lines.push('--' + memory.boundaryAlt)
    lines.push(getMessage())
    lines.push('')

    lines.push('--' + memory.boundaryAlt)
    lines.push(getHTML())
    lines.push('')

    lines.push('--' + memory.boundaryAlt + '--')

    return lines.join('\r\n') + '\r\n'
  }

  function asRawMessage(lines) {
    lines.push(getMessage())

    return lines.join('\r\n') + '\r\n'
  }

  function toBase64(value) {
    return isGas ? Utilities.base64Encode(value, Utilities.Charset.UTF_8) : Buffer.from(asRaw()).toString('base64')
  }

  function toBase64WebSafe(value) {
    return isGas 
      ? Utilities.base64EncodeWebSafe(value) 
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
      : Buffer.from(asRaw()).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
  }

  function asEncoded() {
    return toBase64WebSafe(asRaw())
  }

  function getMessage() {
    return memory.message ? memory.message : memory.html ? memory.html : null
  }

  function getHTML() {
    return memory.html
  }

  function getRecipients() {
    return memory.recipients
  }

  function getCC() {
    return memory.cc
  }

  function getBCC() {
    return memory.bcc
  }

  function getSubject() {
    return memory.subject
  }

  function getSenders() {
    return memory.senders
  }

  function getAttachments() {
    return memory.attachments
  }

  function getHeaders() {
    return memory.headers
  }

  function createMailboxes(inputs) {
    const mailboxes = []
    if (typekit.isObject(inputs)) {
      const name = objectkit.getProp(inputs, 'name')
      const addr = objectkit.getProp(inputs, 'addr')
      if (validationkit.isEmpty(addr)) {
        return undefined
      }

      const obj = {addr: addr}
      if (!validationkit.isEmpty(name)) obj.name = name

      mailboxes.push(obj)

      return mailboxes
    }
    else if (typekit.isString(inputs)) {
      mailboxes.push({addr: inputs})

      return mailboxes
    }
    else if (typekit.isArray(inputs)) {
      let result = []
      for (let i = 0; i < inputs.length; i++) {
        const one = createMailboxes(inputs[i])
        if (!validationkit.isEmpty(one)) {
          result = result.concat(one)
        }
      }
      return result
    }
    else {
      return mailboxes
    }
  }

  function createMailboxStr(mailboxes) {
    if (validationkit.isEmpty(mailboxes)) {
      return ''
    }

    return mailboxes.reduce(function(memo, obj, ind) {
      memo += obj.name ? '"' + obj.name + '" <' + obj.addr + '>' : obj.addr
      if (mailboxes.length !== ind + 1) memo += ', '
      return memo
    }, '')
  }

  function createDateStr() {
    return (new Date().toGMTString()).replace(/GMT|UTC/gi, '+0000')
  }

  function createMsgID() {
    const randomStr = Math.random().toString(36).slice(2)
    const timestamp = memory.timestamp.toString()
    const senderHost = memory.senders[0].addr.split('@')[1]

    return '<' + randomStr + '-' + timestamp + '@' + senderHost + '>'
  }

  function guessMessageType(msg) {
    if (msg.indexOf('<') !== -1 && msg.indexOf('>') !== -1) {
      return 'text/html'
    }
    else {
      return 'text/plain'
    }
  }

  function genNewBoundary() {
    memory.boundaryNumber += 1

    const randomStr = Math.random().toString(36).slice(2)

    return memory.boundaryNumber.toString()
      + randomStr
      + memory.timestamp.toString()
  }

  return {
    setSender: setSender,
    setRecipient: setRecipient,
    setSubject: setSubject,
    setMessage: setMessage,
    setAttachments: setAttachments,
    setHeaders: setHeaders,
    asRaw: asRaw,
    asEncoded: asEncoded,
    getMessage: getMessage,
    getHTML: getHTML,
    getRecipients: getRecipients,
    getCC: getCC,
    getBCC: getBCC,
    getSubject: getSubject,
    getSenders: getSenders,
    getAttachments: getAttachments,
    getHeaders: getHeaders
  }
}

module.exports = MIMEMessage()
