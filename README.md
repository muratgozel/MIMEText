# MIMEText
RFC-5322 compliant, fully typed and documented email message generator for javascript runtimes.

> Earlier specification RFC-2822 obsoleted by RFC-5322, therefore this library aims to be fully compliant with RFC-5322 and it's decendant specifications.

## Installation
### npm
It's published on [npm](https://www.npmjs.com/package/mimetext). Any package manager compatible with it, should work:
```sh
npm i mimetext
# or
pnpm add mimetext
# or
yarn add mimetext
```

### Standalone Browser Script
There is an [iife version](dist/mimetext.iife.js) (immediatly invoked function). This file includes polyfills and transforms that is neccessary to work on almost all browsers. Use it in your html documents but be aware of its size (~50kb).
```html
<script type="text/javascript" src="/path/to/mimetext.iife.js"></script>
<script type="text/javascript">
    console.log(window.MimeText)
</script>
```

### Google Apps Script
There is a special export that is compatible with Google Apps Script environment. Use [gas.cjs](https://github.com/muratgozel/MIMEText/blob/master/dist/gas.cjs) as necessary.

## Usage
The code is optimized for different environments such as node, browser and gas (Google Apps Script). Therefore, the library has three corresponding exports:
```ts
import { createMimeMessage } from 'mimetext/node'
import { createMimeMessage } from 'mimetext/browser'
import { createMimeMessage } from 'mimetext/gas'
// defaults to node export
import { createMimeMessage } from 'mimetext'
```
They all have the same API but minor internal differences. Apart from environment, it can be imported as commonjs module too:
```ts
const { createMimeMessage } = require('mimetext')
const { createMimeMessage } = require('mimetext')
const { createMimeMessage } = require('mimetext')
// defaults to node export
const { createMimeMessage } = require('mimetext')
```

### Simple Email Message
Here is a simple plain text email message:
```js
import { createMimeMessage } from 'mimetext'

const msg = createMimeMessage()
msg.setSender({name: 'Lorem Ipsum', addr: 'lorem@ipsum.com'})
msg.setRecipient('foobor@test.com')
msg.setSubject('🚀 Issue 49!')
msg.addMessage({
    contentType: 'text/plain',
    data: `Hi,
I'm a simple text.`
})
const raw = msg.asRaw()

/*
Date: Sun, 24 Oct 2021 04:50:32 +0000
From: "Lorem Ipsum" <lorem@ipsum.com>
To: <foobor@test.com>
Message-ID: <is6jcakaj6p-1635051032602@ipsum.com>
Subject: =?utf-8?B?8J+agCBJc3N1ZSA0OSE=?=
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Hi,
I'm a simple text.
*/
```

### APIs for Adding Different Kind and Way of Recipients
```js
msg.setTo('first@last.com')
msg.setCc('first@last.com')
msg.setBcc('first@last.com')

// "To" by default
msg.setRecipient('Firstname Lastname <first@last.com>')
// but you can still specify other kinds
msg.setRecipient('Firstname Lastname <first@last.com>', {type: 'Cc'})
// all as object
msg.setRecipient({
    addr: 'first@last.com', 
    name: 'Firstname Lastname', 
    type: 'Bcc'
})

// multiple recipients, each as argument
msg.setRecipients(
    'test@mail.com', 
    'Firstname Lastname <first@last.com>', 
    {addr: 'multiple@mail.com'}
)
```

### HTML Message With Plain Text Fallback And Attachments
Both html and plain text version of a message can be set and attachments can be added. Here is a more complex example:
```js
const msg = createMimeMessage()

msg.setSender('sender@mail.com')
msg.setRecipients('recipient@mail.com')
msg.setSubject('Testing MimeText 🐬 (Plain Text + HTML With Mixed Attachments)')

msg.addMessage({
    contentType: 'text/plain',
    data: 'Hello there,' + EOL + EOL +
        'This is a test email sent by MimeText test suite.'
})
msg.addMessage({
    contentType: 'text/html',
    data: 'Hello there,<br><br>' +
        'This is a test email sent by <b>MimeText</b> test suite.<br><br>' +
        'The term MimeText above supposed to be bold. Are you able to see it?<br><br>' +
        'Below, there should be a small image that contains little black dots:<br><br>' +
        // using an inline attachment id here:
        '<img src="cid:dots123456"><br><br>' +
        'Best regards.'
})

// and the inline attachment:
msg.addAttachment({
    inline: true,
    filename: 'dots.jpg',
    contentType: 'image/jpg',
    data: '...base64 encoded data...',
    headers: {'Content-ID': 'dots123456'}
})

// two more attachments but they aren't inlined, they are attached
msg.addAttachment({
    filename: 'sample.jpg',
    contentType: 'image/jpg',
    data: '...base64 encoded data...'
})
msg.addAttachment({
    filename: 'sample.txt',
    contentType: 'text/plain',
    data: '...base64 encoded data...'
})

const raw = msg.asRaw()

/*
Date: Sun, 26 Mar 2023 13:27:15 +0000
From: <sender@mail.com>
To: <recipient@mail.com>
Message-ID: <vrye3zjqd@gozel.com.tr>
Subject: =?utf-8?B?VGVzdGluZyBNaW1lVGV4dCDwn5CsIChQbGFpbiBUZXh0ICsgSFRNTCBXaXRoIE1peGVkIEF0dGFjaG1lbnRzKQ==?=
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary=giev1zqo579

--giev1zqo579
Content-Type: multipart/related; boundary=hl6rtnn5jq

--hl6rtnn5jq
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 7bit

Hello there,<br><br>This is a test email sent by <b>MimeText</b> test suite.<br><br>The term MimeText above supposed to be bold. Are you able to see it?<br><br>Below, there should be a small image that contains little black dots:<br><br><img src="cid:dots123456"><br><br>Best regards.

--hl6rtnn5jq
Content-ID: <dots123456>
Content-Type: image/jpg; name="dots.jpg"
Content-Transfer-Encoding: base64
Content-Disposition: inline; filename="dots.jpg"

/9j/4AAQSkZJRgABAgEASABIAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQ...........BPwAp/9k=
--hl6rtnn5jq--
--giev1zqo579
Content-Type: image/jpg; name="sample.jpg"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="sample.jpg"

/9j/4AAQSkZJRgABAg...........befPb4N8Hn4A/9k=

--giev1zqo579
Content-Type: text/plain; name="sample.txt"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="sample.txt"

SGVsbG8gdGhlcmUu
--giev1zqo579--
*/
```

### Encoding The Output
Service providers may ask for the encoded version of a message. In that case use the `.asEncoded()` call instead of `.asRaw()`:
```ts
// base64-websafe encoded message
// it first gets the raw version and then encodes it.
msg.asEncoded()
```

## Use Cases
- Email delivery services might ask you to prepare an email message in raw format before sending it with their email client.
- When email message testing or parsing needed.
- Preference.

Here are two examples that uses **Amazon SES** and **Google Gmail** for email sending.

### Amazon SES with AWS-SDK Client V1
```js
// install with npm i @aws-sdk/client-ses

const { SESClient, SendRawEmailCommand } = require('@aws-sdk/client-ses')
const ses = new SESClient({ region: 'YOUR_REGION' })
const { Buffer } = require('node:buffer')
const { createMimeMessage } = require('mimetext')

const message = createMimeMessage()
message.setSender('sender@email.com')
message.setTo('person1@email.com')
message.setSubject('Weekly Newsletter 49 Ready 🚀')
message.addAttachment({
  filename: 'bill.pdf',
  contentType: 'application/pdf',
  data: '...base64 encoded data...'
})
message.addMessage({
  contentType: 'text/html',
  data: 'Hello <b>John</b>.'
})

// send
const params = {
  Destinations: message.getRecipients({type: 'to'})
    .map(mailbox => mailbox.addr),
  RawMessage: {
      // the raw message data needs to be sent as uint8array
      Data: Buffer.from(message.asRaw(), 'utf8')
  },
  Source: message.getSender().addr
}
const result = await ses.send(new SendRawEmailCommand(params))

// expect result.MessageId
```

### Amazon SES with AWS-SDK Client V2
```js
// install with npm i @aws-sdk/client-sesv2

const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-ses')
const ses = new SESv2Client({ region: 'YOUR_REGION' })
const { Buffer } = require('node:buffer')
const { createMimeMessage } = require('mimetext')

const message = createMimeMessage()
message.setSender('sender@email.com')
message.setTo('person1@email.com')
message.setSubject('Weekly Newsletter 49 Ready 🚀')
message.addAttachment({
    filename: 'bill.pdf',
    contentType: 'application/pdf',
    data: '...base64 encoded data...'
})
message.addMessage({
    contentType: 'text/html',
    data: 'Hello <b>John</b>.'
})

const params = {
    FromEmailAddress: message.getSender().addr,
    Destination: {
        ToAddresses: message.getRecipients()
            .map((box) => box.addr)
    },
    Content: {
        Raw: {
            Data: Buffer.from(message.asRaw(), 'utf8')
        }
    }
}
const result = await ses.send(new SendEmailCommand(params))

// result.MessageId
```

### Google Gmail with googleapis-sdk

```js
// init google api sdk
const {google} = require('googleapis')
const {createMimeMessage} = require('mimetext')

const message = createMimeMessage()
message.setSender('sender@email.com')
message.setTo('person1@email.com')
message.setSubject('Weekly Newsletter 49 Ready 🚀')
message.addAttachment({
    filename: 'bill.pdf',
    contentType: 'application/pdf',
    data: '...base64 encoded data...'
})
message.addMessage({
    contentType: 'text/html',
    data: 'Hello <b>John</b>.'
})

// send
google.auth
  .getClient({scopes: ['https://www.googleapis.com/auth/gmail.send']})
  .then(function(client) {
    client.subject = 'sender@email.com'

    const gmail = google.gmail({ version: 'v1', auth: client })

    gmail.users.messages
      .send({
        userId: 'me',
        requestBody: {
          raw: message.asEncoded()
        }
      })
      .then(function(result) {
        // expect result.id
      })
      .catch(function(err) {

      })
  })
```

## Error Handling
Most of the methods raises `MIMETextError` in case of invalid input. You can catch and handle them accordingly.
```js
try {
  message.setTo({prop: 'invalid'})
} catch (e) {
  e instanceof MIMETextError === true
}
```

## Relevant Specifications
- [RFC-5322](https://datatracker.ietf.org/doc/html/rfc5322)
- [RFC-2045](https://datatracker.ietf.org/doc/html/rfc2045)
- [RFC-2046](https://datatracker.ietf.org/doc/html/rfc2046)
- [RFC-2047](https://datatracker.ietf.org/doc/html/rfc2047)
- [RFC-2048](https://datatracker.ietf.org/doc/html/rfc2048)
- [RFC-2049](https://datatracker.ietf.org/doc/html/rfc2049)

## Contributing
If you're interested in contributing, read the [CONTRIBUTING.md](https://github.com/muratgozel/muratgozel/blob/main/CONTRIBUTING.md) first, please.

---

Thanks for the attention 💙 Any amount of support on [patreon](https://patreon.com/muratgozel?utm_medium=organic&utm_source=github_repo&utm_campaign=github&utm_content=join_link) or [github](https://github.com/sponsors/muratgozel) will return you back as bug fixes, new features and bits and bytes.
