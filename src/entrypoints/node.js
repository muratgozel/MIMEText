import MIMEMessage from '../MIMEMessage.js'

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
}

class NodeMIMEMessage extends MIMEMessage {
  constructor() {
    super(envctx)
  }
}

export function createMimeMessage() {
  return new NodeMIMEMessage()
}
