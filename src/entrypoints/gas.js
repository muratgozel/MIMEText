import MIMEMessage from '../MIMEMessage.js'

const defaultGasEnvCtx = {
  toBase64: function toBase64(data) {
    return Utilities.base64Encode(data, Utilities.Charset.UTF_8)
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return Utilities.base64EncodeWebSafe(data)
  }
}

class GasMIMEMessage extends MIMEMessage {
  constructor(envctx) {
    super({...defaultGasEnvCtx, ...envctx})
  }
}

export function createMimeMessage(envctx) {
  return new GasMIMEMessage(envctx)
}
