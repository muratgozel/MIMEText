const utility = require('my-little-lodash/source')

function MIMEMessage() {
  this.senders = null
  this.recipients = null
  this.subject = null
  this.encodedSubject = null
  this.rawMessage = null
  this.message = null
  this.attachments = null
  this.headers = null;

  this.boundaryNumber = 0
  this.boundaryMixed = null
  this.timestamp = Date.now()
}

MIMEMessage.prototype.utility = utility

MIMEMessage.prototype.createMailboxes = function createMailboxes(inputs) {
  const mailboxes = []
  if (this.utility.isObject(inputs)) {
    const name = this.utility.getProp(inputs, 'name')
    const addr = this.utility.getProp(inputs, 'addr')
    if (this.utility.isEmpty(addr)) {
      return undefined
    }

    const obj = {addr: addr}
    if (!this.utility.isEmpty(name)) obj.name = name

    mailboxes.push(obj)

    return mailboxes
  }
  else if (this.utility.isString(inputs)) {
    mailboxes.push({addr: inputs})

    return mailboxes
  }
  else if (this.utility.isArray(inputs)) {
    let result = []
    for (let i = 0; i < inputs.length; i++) {
      const one = this.createMailboxes(inputs[i])
      if (!this.utility.isEmpty(one)) {
        result = result.concat(one)
      }
    }
    return result
  }
  else {
    return mailboxes
  }
}

MIMEMessage.prototype.createMailboxStr = function createMailboxStr(mailboxes) {
  if (this.utility.isEmpty(mailboxes)) {
    return '';
  }

  return mailboxes.reduce(function(memo, obj, ind) {
    memo += obj.name ? '"' + obj.name + '" <' + obj.addr + '>' : obj.addr
    if (mailboxes.length !== ind + 1) memo += ', '
    return memo
  }, '')
}



MIMEMessage.prototype.setHeaders = function setHeaders(headers) {
  if (this.utility.isEmpty(headers)) {
    return undefined;
  }

  const lines = [];
  for (key in headers) {
    const value = this.utility.getProp(headers, key);
    lines.push(key + ": " + value);
  }

  this.headers = lines.join('\r\n');

}

MIMEMessage.prototype.setSender = function setSender(inputs) {
  const mailboxes = this.createMailboxes(inputs)

  if (this.utility.isEmpty(mailboxes)) {
    return undefined;
  }

  this.senders = mailboxes

  return this.senders
}

MIMEMessage.prototype.setRecipient = function setRecipient(inputs) {
  const mailboxes = this.createMailboxes(inputs)

  if (this.utility.isEmpty(mailboxes)) {
    return undefined;
  }

  this.recipients = mailboxes

  return this.recipients
}

MIMEMessage.prototype.setSubject = function setSubject(value) {
  if (this.utility.isEmpty(value) || !this.utility.isString(value)) {
    return undefined;
  }

  this.subject = value
  this.encodedSubject = '=?utf-8?B?' + Buffer.from(value).toString('base64') + '?='

  return this.subject
}

MIMEMessage.prototype.createDateStr = function createDateStr() {
  return (new Date().toGMTString()).replace(/GMT|UTC/gi, '+0000')
}

MIMEMessage.prototype.createMsgID = function createMsgID() {
  const randomStr = Math.random().toString(36).slice(2)
  const timestamp = this.timestamp.toString()
  const senderHost = this.senders[0].addr.split('@')[1]

  return '<' + randomStr + '-' + timestamp + '@' + senderHost + '>'
}

MIMEMessage.prototype.guessMessageType = function guessMessageType(msg) {
  if (msg.indexOf('<') !== -1 && msg.indexOf('>') !== -1) {
    return 'text/html'
  }
  else {
    return 'text/plain'
  }
}

MIMEMessage.prototype.setAttachments = function setAttachments(attachments) {
  if (this.utility.isEmpty(attachments)) {
    return undefined;
  }

  this.boundaryMixed = this.genNewBoundary()

  const lines = []
  for (let i = 0; i < attachments.length; i++) {
    const attachment = attachments[i]

    const type = this.utility.getProp(attachment, 'type')
    const filename = this.utility.getProp(attachment, 'filename')
    const base64Data = this.utility.getProp(attachment, 'base64Data')

    if (!this.utility.isEmpty(type)
      && !this.utility.isEmpty(filename)
      && !this.utility.isEmpty(base64Data)
    ) {
      lines.push('')
      lines.push('--' + this.boundaryMixed)
      lines.push('Content-Type: ' + attachment.type)
      lines.push('Content-Transfer-Encoding: base64')
      lines.push('Content-Disposition: attachment;filename="' + attachment.filename + '"')
      lines.push('')
      lines.push(attachment.base64Data)
    }
  }

  if (!this.utility.isEmpty(lines)) {
    this.attachments = lines.join('\r\n')
  }

  return this.attachments
}

MIMEMessage.prototype.setMessage = function setMessage(msg) {
  if (!this.utility.isString(msg)) {
    return undefined
  }

  const msgType = this.guessMessageType(msg)
  this.rawMessage = msg
  this.message = [
    'Content-Type: ' + msgType + '; charset="utf-8"',
    '',
    msg
  ].join('\r\n')

  return this.rawMessage
}

MIMEMessage.prototype.asRaw = function asRaw() {
  let lines = []

  lines.push('From: ' + this.createMailboxStr(this.senders))
  lines.push('To: ' + this.createMailboxStr(this.recipients))
  lines.push('Subject: ' + this.encodedSubject)
  lines.push('MIME-Version: 1.0')
  lines.push('Date: ' + this.createDateStr())
  lines.push('Message-ID: ' + this.createMsgID())
  lines.push(this.headers);

  if (!this.utility.isEmpty(this.attachments)) {
    lines.push('Content-Type: multipart/mixed; boundary=' + this.boundaryMixed)
    lines.push('')
    lines.push('--' + this.boundaryMixed)
  }

  lines.push(this.message)

  if (!this.utility.isEmpty(this.attachments)) {
    lines.push(this.attachments)
    lines.push('')
    lines.push('--' + this.boundaryMixed + '--')
  }

  return lines.join('\r\n') + '\r\n';
}

MIMEMessage.prototype.asEncoded = function asEncoded() {
  return Buffer
    .from(this.asRaw())
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

MIMEMessage.prototype.genNewBoundary = function genNewBoundary() {
  this.boundaryNumber += 1

  const randomStr = Math.random().toString(36).slice(2)

  return this.boundaryNumber.toString()
    + randomStr
    + this.timestamp.toString()
}

MIMEMessage.prototype.getMessage = function getMessage() {
  return this.message
}

MIMEMessage.prototype.getRecipients = function getRecipients() {
  return this.recipients
}

MIMEMessage.prototype.getSubject = function getSubject() {
  return this.subject
}

MIMEMessage.prototype.getSenders = function getSenders() {
  return this.senders
}

MIMEMessage.prototype.getAttachments = function getAttachments() {
  return this.attachments
}

module.exports = MIMEMessage
