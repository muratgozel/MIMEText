import MIMEMessageHeader from './MIMEMessageHeader.js'

export default class MIMEMessageContent {
  constructor(data) {
    this.maxLineLen = 78
    this.data = data
    this.headers = new MIMEMessageHeader('content')
  }

  setHeader() {
    this.headers.set(arguments[0], arguments[1])
    return this
  }

  setHeaders(obj) {
    Object.keys(obj).map(prop => this.setHeader(prop, obj[prop]))
    return this
  }

  getHeaders() {
    return this.headers.toObject()
  }

  getHeader(name) {
    return this.headers.get(name)
  }

  isAttachment() {
    const d = this.headers.get('Content-Disposition')
    return d && d.indexOf('attachment') !== -1 ? true : false;
  }

  dump(envctx, boundaries) {
    const headerBlock = this.headers.dump(envctx)

    if (this.isAttachment()) {
      return `--${boundaries.mixed}
${headerBlock}

${this.data}
`
    }
    else {
      return `${headerBlock}\r\n\r\n${this.data}`
    }
  }
}
