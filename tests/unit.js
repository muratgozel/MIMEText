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

msg1.setSender(' Lorem Ipsum Trimmus <lorem@ipsum.trimmus.com> ')
assert.strictEqual(msg1.getSender().name, 'Lorem Ipsum Trimmus')
assert.strictEqual(msg1.getSender().addr, 'lorem@ipsum.trimmus.com')

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

const htmlmsg = `<h1>HTML Ipsum Presents</h1>

\t\t\t\t<p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>

\t\t\t\t<h2>Header Level 2</h2>

\t\t\t\t<ol>
\t\t\t\t   <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
\t\t\t\t   <li>Aliquam tincidunt mauris eu risus.</li>
\t\t\t\t</ol>

\t\t\t\t<blockquote><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget ligula molestie gravida. Curabitur massa. Donec eleifend, libero at sagittis mollis, tellus est malesuada tellus, at luctus turpis elit sit amet quam. Vivamus pretium ornare est.</p></blockquote>

\t\t\t\t<h3>Header Level 3</h3>

\t\t\t\t<ul>
\t\t\t\t   <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
\t\t\t\t   <li>Aliquam tincidunt mauris eu risus.</li>
\t\t\t\t</ul>`
msg1.setMessage('text/html', htmlmsg)
const msg1altraw = msg1.asRaw()
//console.log(msg1altraw)

msg1.setAttachment('test.txt', 'image/jpg', msg1.toBase64( fs.readFileSync('./tests/test.jpg') ))
const msg1altmixedraw = msg1.asRaw()
console.log(msg1altmixedraw)
