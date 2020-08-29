# MIMEText

[RFC 2822][45367a6f] compliant email message generator written in node.js

  [45367a6f]: https://www.ietf.org/rfc/rfc2822.txt "RFC 2822 Internet Message Format"

## Install

```sh
npm install mimetext
```

## Import

This package exports only one build which is `src/index.js`

```js
const MIMEText = require('mimetext')
```

## API

### .setSender(value)

Possible values of the `value` are:

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

### .setRecipient(value)

Possible values of the `value` are:

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

`value` must be `string`. Returns `undefined` or value.

```js
const value = 'Weekly Newsletter 49 Ready 🚀'

message.setSubject(value)
```

### .getSubject()

Returns `null` or subject as string.

### .setAttachments(value)

`value` is an attachment object or array of attachment objects. An attachment object is something like:

```js
const sampleBillAttachment = {
  type: 'application/pdf',
  filename: 'sample-bill.pdf',
  base64Data: '' /* Base64 encoded value of the file content.
  fs.readFileSync('./sample-bill.pdf').toString('base64') for example. */
}
```

Let's add more attachments into our email message:

```js
const anotherBillAttachment = {
  type: 'image/jpeg',
  filename: 'another-bill.jpg',
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

### .setMessage(value)

`value` is the content of the email. It can be plain text or html.

```js
const plaintextContent = 'Hello John.'
message.setMessage(plaintextContent)

// or

const htmlContent = 'Hello <b>John</b>.'
message.setMessage(htmlContent)
```

Returns `undefined` or the value you set.

### .getMessage()

Returns `null` or message as you set.

### .asRaw()

Generates and returns the RFC-2822 compliant email message. This message can be used to send an email.

Looks like:

```txt
From: sender@email.com
To: person1@email.com, person2@email.com
Subject: =?utf-8?B?SGVsbG8g8J+WkA==?=
MIME-Version: 1.0
Date: Wed, 26 Jun 2019 13:52:58 +0000
Message-ID: <t0zh6k2srir-1561557178826@email.com>
Content-Type: multipart/mixed; boundary=1dfkwsmmm6os1561557178826

--1dfkwsmmm6os1561557178826
Content-Type: text/plain; charset="utf-8"

Hello John.

--1dfkwsmmm6os1561557178826
Content-Type: image/jpeg
Content-Transfer-Encoding: base64
Content-Disposition: attachment;filename="another-bill.jpg"

/9j/4AAQSkZJRgAB......pX2NKUaUo0pX/2Q==
--1dfkwsmmm6os1561557178826--
```

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
const MIMEText = require('mimetext')

// create email message
const message = new MIMEText()
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
const MIMEText = require('mimetext')
const message = new MIMEText()
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
