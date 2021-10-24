# MIMEText
[RFC 2822][45367a6f] compliant raw email message generator written in node.js

  [45367a6f]: https://www.ietf.org/rfc/rfc2822.txt "RFC 2822 Internet Message Format"

![NPM](https://img.shields.io/npm/l/mimetext)
[![npm version](https://badge.fury.io/js/mimetext.svg)](https://badge.fury.io/js/mimetext)
![npm bundle size](https://img.shields.io/bundlephobia/min/mimetext)
![npm](https://img.shields.io/npm/dm/mimetext)
[![Join the chat at https://gitter.im/MIMEText/community](https://badges.gitter.im/MIMEText/community.svg)](https://gitter.im/MIMEText/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Install
```sh
npm i mimetext
```

## Use
```js
const {createMimeMessage} = require('mimetext')
// or
import {createMimeMessage} from 'mimetext'
```

Create a simple **plain text** email:
```js
const msg = createMimeMessage()
msg.setSender({name: 'Lorem Ipsum', addr: 'lorem@ipsum.com'})
msg.setRecipient('foobor@test.com')
msg.setSubject('🚀 Issue 49!')
msg.setMessage('text/plain', `Hi,
I'm a simple text.`)
```

That's it. Now get the raw email message:
```js
const raw = msg.asRaw()
```

Output:
```txt
Date: Sun, 24 Oct 2021 04:50:32 +0000
From: "Lorem Ipsum" <lorem@ipsum.com>
To: <foobor@test.com>
Message-ID: <is6jcakaj6p-1635051032602@ipsum.com>
Subject: =?utf-8?B?8J+agCBJc3N1ZSA0OSE=?=
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Hi,
I'm a simple text.
```

### More Sophisticated Example
Here is more complex email message which contains **html** with **plaintext** version and has an **attachment**.
```js
const msg = createMimeMessage()
msg.setSender('Lorem Ipsum <lorem@ipsum.com>')
msg.setTo({name: 'Foo Bar', addr: 'foobor@test.com'})
msg.setCc('Abc Def <abc@def.com>')
msg.setBcc(['fgh@jkl.com', 'test2@test.com', {name: 'Name', addr: 'test3@test.com'}])
msg.setSubject('🚀 Issue 49!')
// add html version
msg.setMessage('text/html', `Hi,
I'm <strong>a bold</strong> text.`)
// add alternative plain text version
msg.setMessage('text/plain', `Hi,
I'm a simple text.`)
// set custom header
msg.setHeader('X-Abc', 'asdildffdişfsdi')
// add an attachment
msg.setAttachment('test.jpg', 'image/jpg', msg.toBase64( fs.readFileSync('./tests/test.jpg') ))
```

Here is the output of the `.asRaw`:
```txt
Date: Sun, 24 Oct 2021 05:00:03 +0000
From: "Lorem Ipsum" <lorem@ipsum.com>
To: "Foo Bar" <foobor@test.com>
Cc: "Abc Def" <abc@def.com>
Bcc: <fgh@jkl.com>, <test2@test.com>, "Name" <test3@test.com>
Message-ID: <56y7xuld2n9-1635051603230@ipsum.com>
Subject: =?utf-8?B?8J+agCBJc3N1ZSA0OSE=?=
MIME-Version: 1.0
X-Abc: asdildffdişfsdi
Content-Type: multipart/mixed; boundary=tdplbi0e8pj

--tdplbi0e8pj
Content-Type: multipart/alternative; boundary=oagdypniyp

--oagdypniyp
Content-Type: text/plain; charset=UTF-8

Hi,
I'm a simple text.

--oagdypniyp
Content-Type: text/html; charset=UTF-8

Hi,
I'm <strong>a bold</strong> text.

--oagdypniyp--
--tdplbi0e8pj
Content-Type: image/jpg; charset=UTF-8
Content-Transfer-Encoding: base64
Content-Disposition: attachment;filename="test.jpg"

/9j/4AAQSkZJRgABAgAAZABkAAD/7AARR....................Oc2YO5LuFLMxUeBjH5//2Q==

--tdplbi0e8pj--
```

## API
### .setSender(value)
Sender can be specified in multiple ways:
```js
message.setSender('sender@email.com')
message.setSender('"Sender Fullname" <sender@email.com>')
message.setSender({name: 'Sender Name', addr: 'sender@email.com'})
message.setSender(['sender@email.com', 'sender2@email.com'])
```
Returns [`Mailbox`](https://github.com/muratgozel/MIMEText/blob/master/src/Mailbox.js) instance.

### .getSender()
Returns [`Mailbox`](https://github.com/muratgozel/MIMEText/blob/master/src/Mailbox.js) instance.

### .setTo(value), .setCc(value), .setBcc(value), .setRecipient(value, opts)
All of the `.setTo`, `.setCc` and `.setBcc` methods maps their input to `.setRecipient`. Returns array of [`Mailbox`](https://github.com/muratgozel/MIMEText/blob/master/src/Mailbox.js) instances.
```js
message.setTo('person1@email.com')
message.setTo('"Person Fullname" <person@email.com>')
message.setTo({name: 'Person Name', addr: 'person2@email.com'})
message.setTo([
  'person3@email.com',
  {name: 'Person Name', addr: 'person4@email.com'}
])

message.setRecipient('person5@email.com', {type: 'to'}) // to is default
```

### .getRecipients(opts={type: 'to'})
Returns array of [`Mailbox`](https://github.com/muratgozel/MIMEText/blob/master/src/Mailbox.js) instances.

### .setSubject(value)
Returns the `value`.
```js
const value = 'Weekly Newsletter 49 Ready 🚀'
message.setSubject(value)
```

### .getSubject()
Returns the `value`.

### .setHeader()
Inserts a header to the message.
```js
message.setHeader('X-Custom-Header', 'value')
```

### .getHeader(name)
Returns the value of the header.

### .setMessage(type, data, moreHeaders={})
Adds a content to the email. Valid values for `type` are `text/plain` and `text/html`. `data` is the content. Headers for this content can be specified with `moreHeaders`. Returns [`MIMEMessageContent`](https://github.com/muratgozel/MIMEText/blob/master/src/MIMEMessageContent.js) instance.
```js
// plain text
message.setMessage('text/plain', 'This is plain text.')

// or/and html
message.setMessage('text/html', 'This is <strong>html</strong>.')

// or in base64 encoded format
const encoded = message.toBase64('This is <strong>html</strong>.')
const headers = {'Content-Transfer-Encoding': 'base64'}
message.setMessage('text/html', encoded, headers)
```

### .getMessageByType(type)
Returns [`MIMEMessageContent`](https://github.com/muratgozel/MIMEText/blob/master/src/MIMEMessageContent.js) instance.

### .setAttachment(filename, type, data, moreHeaders={})
Adds an attachment to the email. `type` is the mime type of the file. `data` should be base64 encoded content of the file. Headers for this attachment can be specified with `moreHeaders`. Returns [`MIMEMessageContent`](https://github.com/muratgozel/MIMEText/blob/master/src/MIMEMessageContent.js) instance.
```js
const encoded = message.toBase64( fs.readFileSync('./tests/test.jpg') )
message.setAttachment('test.jpg', 'image/jpg', encoded)

// add content id header to use the attachment inside email body
// <img src="cid:abc123">
message.setAttachment('test.jpg', 'image/jpg', encoded, {
  'Content-ID': 'abc123'
})
```

### .getAttachments()
Returns an array of [`MIMEMessageContent`](https://github.com/muratgozel/MIMEText/blob/master/src/MIMEMessageContent.js) instances.

### .asRaw()
Generates and returns the RFC-2822 compliant email message. This message can be used to send an email.

### .asEncoded()
Generates and returns the base64 **encoded** RFC-2822 compliant email message. This message also can be used to send an email.

## Use Cases
Some of email services such as **Amazon SES** or **Google Gmail** may require you to create the mime message to send an email programmatically. This library built for those kind of services but mime messages already has a wide range of use cases in general.

### Amazon SES with AWS-SDK

```js
// init aws sdk
const AWS = require('aws-sdk')
const ses = new AWS.SES({region: ''})

// init mimetext
const {createMimeMessage} = require('mimetext')
const message = createMimeMessage()

// create email message
message.setSender('sender@email.com')
message.setTo('person1@email.com')
message.setSubject('Weekly Newsletter 49 Ready 🚀')
message.setAttachment('bill.pdf', 'application/pdf', data)
message.setMessage('text/html', 'Hello <b>John</b>.')

// send email with aws sdk
const params = {
  Destinations: message.getRecipients({type: 'to'}).map(mailbox => mailbox.addr),
  RawMessage: {
    Data: message.asRaw() // aws-sdk does the base64 encoding
  },
  Source: message.getSender().addr
}

ses.sendRawEmail(params, function(err, result) {
  // err or result.MessageId
})
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
message.setAttachment('bill.pdf', 'application/pdf', data)
message.setMessage('text/html', 'Hello <b>John</b>.')

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
Setter methods raise an instance [`MIMETextError`](https://github.com/muratgozel/MIMEText/blob/master/src/MIMETextError.js) on bad input.
```js
try {
  message.setTo({prop: 'invalid'})
} catch (e) {
  e instanceof MIMETextError === true
  e.name === 'MIMETextError'
  e.description === 'The input should have an "addr" property that specifies ...'
}
```

---

Version management of this repository done by [releaser](https://github.com/muratgozel/node-releaser) 🚀

---

Thanks for watching 🐬

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F1RFO7)
