import MIMEMessage from '../MIMEMessage.js'

const envctx = {
  toBase64: function toBase64(data) {
    return btoa(data)
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return btoa(data)
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
