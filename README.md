# MIMEText

[![Join the chat at https://gitter.im/MIMEText/community](https://badges.gitter.im/MIMEText/community.svg)](https://gitter.im/MIMEText/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[RFC 2822][45367a6f] compliant raw email message generator written in node.js

  [45367a6f]: https://www.ietf.org/rfc/rfc2822.txt "RFC 2822 Internet Message Format"

## Install
```sh
npm i mimetext
```

## Import
```js
const message = require('mimetext')
```

## API
### .setSender(value)
Sets the From field.
```js
// single sender, only email address known
message.setSender('sender@email.com')

// single sender, name and email known
message.setSender({name: 'Sender Name', addr: 'sender@email.com'})

// multiple senders, only email addresses known
message.setSender(['sender@email.com', 'sender2@email.com'])

// multiple senders, name and emails known
message.setSender([
  {name: 'Sender Name', addr: 'sender@email.com'},
  {name: 'Another Sender', addr: 'sender2@email.com'}
])
```
Returns `undefined` or senders as formatted:
```js
[
  {
    addr: 'sender@email.com'
  }
]

// or

[
  {
    name: 'Sender Name',
    addr: 'sender@email.com'
  },
  {
    name: 'Another Sender',
    addr: 'sender2@email.com'
  }
]
```

### .getSenders()
Returns `null` or senders as formatted.

### .setRecipient(value, opts)
Sets To, Cc or Bcc field depending on the opts.
```js
// single recipient, only email address known
message.setRecipient('person1@email.com')

// single recipient, name and email known
message.setRecipient({name: 'Person Name', addr: 'person1@email.com'})

// multiple recipients, only email addresses known
message.setRecipient(['person1@email.com', 'person2@email.com'])

// multiple recipients, name and emails known
message.setRecipient([
  {name: 'Person Name', addr: 'person1@email.com'},
  {name: 'Another Person', addr: 'person2@email.com'}
])

// add to cc
message.setRecipient('person3@email.com', {cc: true})

// add to bcc
message.setRecipient([
  {name: 'Person Name', addr: 'person4@email.com'},
  {name: 'Another Person', addr: 'person5@email.com'}
], {bcc: true})
```
Returns `undefined` or recipients as formatted:
```js
[
  {
    addr: 'person1@email.com'
  }
]

// or

[
  {
    name: 'Person Name',
    addr: 'person1@email.com'
  },
  {
    name: 'Another Person',
    addr: 'person2@email.com'
  }
]
```

### .getRecipients()
Returns `null` or recipients as formatted.

### .setSubject(value)
Sets subject. `value` must be `string`. Returns `undefined` or value.
```js
const value = 'Weekly Newsletter 49 Ready 🚀'

message.setSubject(value)
```

### .getSubject()
Returns `null` or subject as string.

### .setAttachments(value)
Sets one or more attachments. `value` is an attachment object or array of attachment objects. An attachment object is something like:
```js
const sampleBillAttachment = {
  type: 'application/pdf',
  filename: 'sample-bill.pdf',
  contentId: 'sb123', // optional, can be used in case you need to show an image in email body like: <img src="cid:abc123">
  base64Data: '' /* Base64 encoded value of the file content.
  fs.readFileSync('./sample-bill.pdf').toString('base64') for example. */
}
```
Let's add more attachments into our email message:

```js
const anotherBillAttachment = {
  type: 'image/jpeg',
  filename: 'another-bill.jpg',
  contentId: 'ab123',
  base64Data: ''
}

message.setAttachments([sampleBillAttachment, anotherBillAttachment])
```
Returns empty array or attachments added into the message.

### .getAttachments()
Returns `[]` (empty array) or attachments.

### .setHeaders()
Insert extra headers to the message.

```js
const customHeaders = {
  'X-Custom-Header': 'Value',
  'X-Another-Header', 'Another Value'
}
message.setHeaders(customHeaders)
```

### .getHeaders()
Returns `null` or headers as string.

### .setMessage(value, type=undefined)
Set content. Either plaintext or html. If you don't specify type, it will be detected automatically by looking the `value`.
```js
const plaintextContent = 'Hello John.'
message.setMessage(plaintextContent, 'text/plain')

// or

const htmlContent = 'Hello <b>John</b>.'
message.setMessage(htmlContent, 'text/html')
```
Returns `undefined` or the value you set.

### .getMessage()
Returns `null` or content of the message. Either plaintext or html. If both contents exist it returns **plaintext** version.

### .getHTML()
Returns `null` or **html** content of the message.

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
const message = require('mimetext')

// create email message
message.setSender('sender@email.com')
message.setRecipient('person1@email.com')
message.setSubject('Weekly Newsletter 49 Ready 🚀')
message.setAttachments([sampleBillAttachment, anotherBillAttachment])
message.setMessage('Hello <b>John</b>.')

// send email with aws sdk
const params = {
  Destinations: message.getRecipients().map(r => r.addr),
  RawMessage: {
    Data: message.asRaw() // aws-sdk does the base64 encoding
  },
  Source: message.getSenders()[0].addr
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
const message = require('mimetext')
message.setSender('sender@email.com')
message.setRecipient('person1@email.com')
message.setSubject('Weekly Newsletter 49 Ready 🚀')
message.setAttachments([sampleBillAttachment, anotherBillAttachment])
message.setMessage('Hello <b>John</b>.')

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

## Sample Raw Email Messages
The messages below are the result of the `asRaw` method. You can find the parameters inside tests folder.

Simple **plaintext** email:
```txt
From: person@test.com
To: person2@test.com
Cc: "Person3 Name" <person3@test.com>
Bcc: "Person4 Name" <person4@test.com>
Subject: =?utf-8?B?U2VsYW0h?=
MIME-Version: 1.0
Date: Fri, 24 Sep 2021 18:14:19 +0000
Message-ID: <3butp7cl9dc-1632507259142@test.com>
Content-Type: text/plain; charset="utf-8"

Lorem ipsum.

```

Simple **html** email:
```txt
From: person@test.com
To: person2@test.com
Cc: "Person3 Name" <person3@test.com>
Bcc: "Person4 Name" <person4@test.com>
Subject: =?utf-8?B?U2VsYW0h?=
MIME-Version: 1.0
Date: Fri, 24 Sep 2021 18:17:27 +0000
Message-ID: <i4xpl26o54-1632507447927@test.com>
Content-Type: text/html; charset="utf-8"

Lorem ipsum <b>me!</b>.

```

An **html** email with **plaintext** alternative:
```txt
From: person@test.com
To: person2@test.com
Cc: "Person3 Name" <person3@test.com>
Bcc: "Person4 Name" <person4@test.com>
Subject: =?utf-8?B?U2VsYW0h?=
MIME-Version: 1.0
Date: Fri, 24 Sep 2021 18:20:34 +0000
Message-ID: <p8w1vcnzc6s-1632507634977@test.com>
Content-Type: multipart/alternative; boundary=1mzb8trdm7rh1632507634977

--1mzb8trdm7rh1632507634977
Content-Type: text/plain; charset="utf-8"

Lorem ipsum.

--1mzb8trdm7rh1632507634977
Content-Type: text/html; charset="utf-8"

Lorem ipsum <b>me!</b>.

--1mzb8trdm7rh1632507634977--

```

A **plaintext** email with an **attachment**:
```txt
From: person@test.com
To: person2@test.com
Cc: "Person3 Name" <person3@test.com>
Bcc: "Person4 Name" <person4@test.com>
Subject: =?utf-8?B?U2VsYW0h?=
MIME-Version: 1.0
Date: Fri, 24 Sep 2021 18:33:37 +0000
Message-ID: <gglbwvsyp0q-1632508417475@test.com>
Content-Type: multipart/mixed; boundary=1tcsw3nouuu81632508417475

--1tcsw3nouuu81632508417475
Content-Type: text/plain; charset="utf-8"

Lorem ipsum.

--1tcsw3nouuu81632508417475
Content-Type: image/jpeg
Content-Transfer-Encoding: base64
Content-Disposition: attachment;filename="a1.jpg"

/9j/4AAQSkZJRgABAgEACQAJAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAw..............AnF5QTo3rnGKav0p//9k=

--1tcsw3nouuu81632508417475--

```

An **html** message with **plaintext** alternative and two **attachments**:
```txt
From: person@test.com
To: person2@test.com
Cc: "Person3 Name" <person3@test.com>
Bcc: "Person4 Name" <person4@test.com>
Subject: =?utf-8?B?U2VsYW0h?=
MIME-Version: 1.0
Date: Fri, 24 Sep 2021 18:43:29 +0000
Message-ID: <0bwsb8p3fr18-1632509009196@test.com>
Content-Type: multipart/mixed; boundary=2sdohqqalp5e1632509009196

--2sdohqqalp5e1632509009196
Content-Type: multipart/alternative; boundary=1aa3wr0fq0r1632509009196

--1aa3wr0fq0r1632509009196
Content-Type: text/plain; charset="utf-8"

Lorem ipsum.

--1aa3wr0fq0r1632509009196
Content-Type: text/html; charset="utf-8"

Lorem ipsum <b>me!</b>.

--1aa3wr0fq0r1632509009196--
--2sdohqqalp5e1632509009196
Content-Type: image/jpeg
Content-Transfer-Encoding: base64
Content-Disposition: attachment;filename="a1.jpg"

/9j/4AAQSkZJRgABAgEACQAJAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAw..............AnF5QTo3rnGKav0p//9k=

--2sdohqqalp5e1632509009196
Content-Type: image/jpeg
Content-Transfer-Encoding: base64
Content-Disposition: attachment;filename="a2.jpeg"

/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAsqADAAQAAAABAAAAZAAAAAD.............UzR6tvEtchEDMLGP/wByf//Z

--2sdohqqalp5e1632509009196--

```

---

Version management of this repository done by [releaser](https://github.com/muratgozel/node-releaser) 🚀
