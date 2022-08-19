import MIMEMessage from '../MIMEMessage.js'

const defaultBrowserEnvCtx = {
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
  constructor(envctx) {
    super({...defaultBrowserEnvCtx, ...envctx})
  }
}

export function createMimeMessage(envctx) {
  return new NodeMIMEMessage(envctx)
}
