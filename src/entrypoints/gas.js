import MIMEMessage from '../MIMEMessage.js'

const envctx = {
  toBase64: function toBase64(data) {
    return Utilities.base64Encode(data, Utilities.Charset.UTF_8)
  },
  toBase64WebSafe: function toBase64WebSafe(data) {
    return Utilities.base64EncodeWebSafe(data)
  }
}

class GasMIMEMessage extends MIMEMessage {
  constructor() {
    super(envctx)
  }
}

export function createMimeMessage() {
  return new GasMIMEMessage()
}
