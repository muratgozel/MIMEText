import fs from 'fs'
import MIMEMessage from '../src/MIMEMessage.js'
import Mailbox from '../src/Mailbox.js'
import {createMimeMessage} from '../src/entrypoints/node.js'
import assert from 'assert'

assert.strictEqual(typeof createMimeMessage, 'function')

const msg1 = createMimeMessage()
assert.strictEqual(msg1 instanceof MIMEMessage, true)
assert.strictEqual(msg1.toBase64('🥸 Murat 🐬 Gözel 😄 Çişüğö'), '8J+luCBNdXJhdCDwn5CsIEfDtnplbCDwn5iEIMOHacWfw7zEn8O2')
assert.strictEqual(msg1.boundaries.mixed.length > 2, true)
assert.strictEqual(msg1.boundaries.alt.length > 2, true)

msg1.setSender('Lorem Ipsum <lorem@ipsum.com>')
assert.strictEqual(msg1.getSender() instanceof Mailbox, true)
assert.strictEqual(msg1.getSender().name, 'Lorem Ipsum')
assert.strictEqual(msg1.getSender().addr, 'lorem@ipsum.com')
assert.strictEqual(msg1.getSender().type.toLowerCase(), 'from')

msg1.setTo({name: 'Foo Bör', addr: 'foobor@test.com'})
assert.strictEqual(msg1.getRecipients({type: 'to'}).length > 0, true)
assert.strictEqual(msg1.getRecipients({type: 'to'})[0].name, 'Foo Bör')
assert.strictEqual(msg1.getRecipients({type: 'to'})[0].addr, 'foobor@test.com')

msg1.setCc(['test1@cc.com', 'test2@cc.com', 'test3@cc.com'])
assert.strictEqual(msg1.getRecipients({type: 'cc'}).length > 0, true)
assert.strictEqual(msg1.getRecipients({type: 'cc'})[0].addr, 'test1@cc.com')
assert.strictEqual(msg1.getRecipients({type: 'cc'})[2].addr, 'test3@cc.com')

msg1.setBcc(['test1@bcc.com', 'test2@bcc.com', 'test3@bcc.com'])
assert.strictEqual(msg1.getRecipients({type: 'bcc'}).length > 0, true)
assert.strictEqual(msg1.getRecipients({type: 'bcc'})[0].addr, 'test1@bcc.com')
assert.strictEqual(msg1.getRecipients({type: 'bcc'})[2].addr, 'test3@bcc.com')

msg1.setSubject('🚀 Sample Tötlü')
assert.strictEqual(msg1.getSubject(), '🚀 Sample Tötlü')

msg1.setHeader('X-ABC', 'asdildffdişfsdi')
assert.strictEqual(msg1.getHeader('x-abc'), 'asdildffdişfsdi')

msg1.setMessage('text/plain', 'Hi!')
const plainTextMessage = msg1.getMessageByType('text/plain')
const plainTextMessageDump = `${plainTextMessage.headers.dump(msg1.envctx)}\r\n\r\n${plainTextMessage.data}`
assert.strictEqual(plainTextMessage.data, 'Hi!')
assert.strictEqual(plainTextMessage.headers.get('content-type'), 'text/plain; charset=UTF-8')
assert.strictEqual(plainTextMessage.isAttachment(), false)
assert.strictEqual(plainTextMessage.dump(msg1.envctx, msg1.boundaries), plainTextMessageDump)

const msg1raw = msg1.asRaw()
//console.log(msg1raw)

msg1.setMessage('text/html', '<strong>Hi</strong> everyone!')
const msg1altraw = msg1.asRaw()
//console.log(msg1altraw)

msg1.setAttachment('test.txt', 'image/jpg', msg1.toBase64( fs.readFileSync('./tests/test.jpg') ))
const msg1altmixedraw = msg1.asRaw()
console.log(msg1altmixedraw)
