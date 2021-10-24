export default class MIMETextError extends Error {
  constructor(message, description) {
    super(message)
    this.description = description ? description.trim().replace(/[\s]{2,}/, ' ') : null
    this.name = 'MIMETextError'
  }
}
