# MIMEText
[RFC-2822](https://www.rfc-editor.org/rfc/rfc2822), [RFC-2045](https://www.rfc-editor.org/rfc/rfc2045) and [RFC-2049](https://www.rfc-editor.org/rfc/rfc2049) compliant raw email message generator. Refer to [https://muratgozel.github.io/MIMEText/](https://muratgozel.github.io/MIMEText/) for full api docs.

## Install
```sh
npm i mimetext
```

## Use
```js
// cjs
const {createMimeMessage} = require('mimetext')
// es
import {createMimeMessage} from 'mimetext'

// create a simple plain text email
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

### Different Ways Of Adding Recipients
There are more than one method and format to add recipients:
```js
// adds recipient to To field by default
msg.setRecipient('Firstname Lastname <first@last.com>')
// you can specify To, Cc, Bcc
msg.setRecipient('Firstname Lastname <first@last.com>', {type: 'Cc'})
// as object, only addr is required
msg.setRecipient({addr: 'first@last.com', name: 'Firstname Lastname', type: 'Bcc'})
// shortcut methods
msg.setTo('first@last.com')
msg.setCc('first@last.com')
msg.setBcc('first@last.com')
// multiple recipient at once
msg.setRecipients('test@mail.com', 'Firstname Lastname <first@last.com>', {addr: 'multiple@mail.com'})

// similarly you can set the sender
msg.setSender('First Last <sender@mail.com>')
msg.setSender({name: 'First Last', addr: 'sender@mail.com'})
```

### HTML Message With Plain Text Fallback And Attachments
You can set html and plain text messages both and recipients mail client will render however they think appropriate.

The example below demonstrates more sophisticated email content including inline attachments and regular attachments.
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
// specify inline attachment's content id inside img src tag. <img src="cid:[ID]">
msg.addMessage({
    contentType: 'text/html',
    data: 'Hello there,<br><br>' +
        'This is a test email sent by <b>MimeText</b> test suite.<br><br>' +
        'The term MimeText above supposed to be bold. Are you able to see it?<br><br>' +
        'Below, there should be a small image that contains little black dots:<br><br>' +
        '<img src="cid:dots123456"><br><br>' +
        'Best regards.'
})
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
// this is inline attachment!
msg.addAttachment({
    inline: true,
    filename: 'dots.jpg',
    contentType: 'image/jpg',
    data: '...base64 encoded data...',
    headers: {'Content-ID': 'dots123456'}
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
If you ever need to get base64-websafe encoded version of the raw data, you can use `asEncoded()` method.
```js
// it first gets the raw version and then encodes it.
msg.asEncoded()
```

## Use Cases
MIMEText is useful for email sending platforms and end-user apps whose email clients require raw email messages.

Below you can find some examples for **Amazon SES** or **Google Gmail**.

### Amazon SES with AWS-SDK
ses client v1:
```js
// install with npm i @aws-sdk/client-ses

// init aws sdk
const { SESClient, SendRawEmailCommand } = require('@aws-sdk/client-ses')
const ses = new SESClient({ region: 'YOUR_REGION' })
const { Buffer } = require('node:buffer')

// init mimetext
const { createMimeMessage } = require('mimetext')
const message = createMimeMessage()

// create email message
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

// send email with aws sdk
const params = {
  Destinations: message.getRecipients({type: 'to'}).map(mailbox => mailbox.addr),
  RawMessage: {
    Data: Buffer.from(message.asRaw(), 'utf8') // the raw message data needs to be sent as uint8array
  },
  Source: message.getSender().addr
}
const result = await ses.send(new SendRawEmailCommand(params))
// result.MessageId
```
ses client v2:
```js
// install with npm i @aws-sdk/client-sesv2

// init aws sdk
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-ses')
const ses = new SESv2Client({ region: 'YOUR_REGION' })
const { Buffer } = require('node:buffer')

// init mimetext
const { createMimeMessage } = require('mimetext')
const message = createMimeMessage()

// create email message
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
        ToAddresses: message.getRecipients().map((box) => box.addr)
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

// create email message
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

// send email
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
        // result.id
      })
      .catch(function(err) {

      })
  })
```

## Error Handling
Most of the methods raises `MIMETextError` in case of invalid input. You can catch them and handle them accordingly.
```js
try {
  message.setTo({prop: 'invalid'})
} catch (e) {
  e instanceof MIMETextError === true
}
```

## Contributing
If you're interested in contributing, read the [CONTRIBUTING.md](https://github.com/muratgozel/muratgozel/blob/main/CONTRIBUTING.md) first, please.

---

Version management of this repository done by [releaser](https://github.com/muratgozel/node-releaser) 🚀

---

Thanks for watching 🐬

[![Support me on Patreon](https://cdn.muratgozel.com.tr/support-me-on-patreon.v1.png)](https://patreon.com/muratgozel?utm_medium=organic&utm_source=github_repo&utm_campaign=github&utm_content=join_link)
