import {EOL} from 'node:os'
import {MIMEMessage, MIMEMessageHeader, Mailbox, createMimeMessage, MIMEMessageContent} from '../dist/node.js'

const envctx = {
    toBase64: function toBase64(data) {
        return (new Buffer(data)).toString('base64')
    },
    toBase64WebSafe: function toBase64WebSafe(data) {
        return (new Buffer(data)).toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    },
    eol: EOL,
    validateContentType: (v) => {
        return mime.contentType(v)
    }
}

test('option to skip UTF-8 Base64 encoding for pure ascii headers', () => {
    const validAWSRegex = /^[-?&!$%*\/\\#.^@_~|{}+=`\d\w ]+$/
    const msg = createMimeMessage({ checkHeaderRequiresBase64: (data) => {
        return !validAWSRegex.test(data); // invalid char found, base64 required
    }})
    msg.setHeader('Date', 'Wed, 22 Mar 2023 23:36:33 +0000')
    msg.setHeader('Message-ID', '<oliusb0xvxc@mail.com>')
    msg.setSender('John <test@mail.com>')
    msg.setSubject('Lorem Ipsum')
    msg.addMessage({contentType: 'text/plain', data: 'hello there'})
    expect(msg.asRaw()).toBe('Date: Wed, 22 Mar 2023 23:36:33 +0000' + EOL +
        'From: John <test@mail.com>' + EOL +
        'Message-ID: <oliusb0xvxc@mail.com>' + EOL +
        'Subject: Lorem Ipsum' + EOL +
        'MIME-Version: 1.0' + EOL +
        'Content-Type: text/plain; charset=UTF-8' + EOL +
        'Content-Transfer-Encoding: 7bit' + EOL + EOL +
        'hello there'
    )
})

test('option to skip UTF-8 Base64 encoding for pure ascii headers', () => {
    const validAWSRegex = /^[-?&!$%*\/\\#.^@_~|{}+=`\d\w ]+$/
    const msg = new MIMEMessage(envctx, { checkHeaderRequiresBase64: (data) => {
        return !validAWSRegex.test(data); // invalid char found, base64 required
    }})
    msg.setHeader('Date', 'Wed, 22 Mar 2023 23:36:33 +0000')
    msg.setHeader('Message-ID', '<oliusb0xvxc@mail.com>')
    msg.setSender('John <test@mail.com>')
    msg.setSubject('Lorem Ipsum')
    msg.addMessage({contentType: 'text/plain', data: 'hello there'})

    expect(msg.getMessageByType('text/plain')).toBeInstanceOf(MIMEMessageContent)
    expect(msg.asRaw()).toBe('Date: Wed, 22 Mar 2023 23:36:33 +0000' + envctx.eol +
        'From: John <test@mail.com>' + envctx.eol +
        'Message-ID: <oliusb0xvxc@mail.com>' + envctx.eol +
        'Subject: Lorem Ipsum' + envctx.eol +
        'MIME-Version: 1.0' + envctx.eol +
        'Content-Type: text/plain; charset=UTF-8' + envctx.eol +
        'Content-Transfer-Encoding: 7bit' + envctx.eol + envctx.eol +
        'hello there'
    )
})

test('sets and reads headers, base64 encode even pure-ascii headers by default', () => {
    const a = new MIMEMessageHeader(envctx)
    a.set('From', new Mailbox('Alice <test@test.com>'))
    a.set('To', new Mailbox('Bob <to@test.com>'))
    a.set('Cc', [new Mailbox('Charlie One <cc@test.com>'), new Mailbox('Charlie Two <cc2@test.com>')])
    a.set('Bcc', [new Mailbox('Daniel One <bcc@test.com>'), new Mailbox('Daniel Two <bcc2@test.com>')])
    a.set('Reply-To', new Mailbox('Emily <replyto@test.com>'))
    a.set('Subject', 'Testing')
    a.set('Date', 'Wed, 22 Mar 2023 12:12:02 +0000')
    a.set('Message-ID', '<qjuijvi0ie@test.com>')
    a.set('X-Custom', 'true')
    a.setCustom({name: 'X-Something', value: 'thing'})
    const adump = a.dump()

    expect(a.get('From')).toBeInstanceOf(Mailbox)
    expect(a.get('Subject')).toBe('Testing')
    expect(adump).toBe(
        'Date: Wed, 22 Mar 2023 12:12:02 +0000' + envctx.eol +
        'From: =?utf-8?B?QWxpY2U=?= <test@test.com>' + envctx.eol +
        'Reply-To: =?utf-8?B?RW1pbHk=?= <replyto@test.com>' + envctx.eol +
        'To: =?utf-8?B?Qm9i?= <to@test.com>' + envctx.eol +
        'Cc: =?utf-8?B?Q2hhcmxpZSBPbmU=?= <cc@test.com>,' + envctx.eol +
        ' =?utf-8?B?Q2hhcmxpZSBUd28=?= <cc2@test.com>' + envctx.eol +
        'Bcc: =?utf-8?B?RGFuaWVsIE9uZQ==?= <bcc@test.com>,' + envctx.eol +
        ' =?utf-8?B?RGFuaWVsIFR3bw==?= <bcc2@test.com>' + envctx.eol +
        'Message-ID: <qjuijvi0ie@test.com>' + envctx.eol +
        'Subject: =?utf-8?B?VGVzdGluZw==?=' + envctx.eol +
        'MIME-Version: 1.0' + envctx.eol +
        'X-Custom: true' + envctx.eol +
        'X-Something: thing'
    )
    expect(() => a.setCustom('something')).toThrow()
    expect(() => a.setCustom({name: 'something'})).toThrow()
    expect(() => a.set('Sender', 'some')).toThrow()
    expect(() => a.set('From', [new Mailbox('from@test.com'), new Mailbox('from2@test.com')])).toThrow()
})

const validAWSRegex = /^[-?&!$%*\/\\#.^@_~|{}+=`\d\w ]+$/

test('sets and reads headers with encoded unicode values by default', () => {
    const a = new MIMEMessageHeader(envctx, { checkBase64HeaderRequired: (data) => {
        return !validAWSRegex.test(data); // invalid char found
    }})
    a.set('From', new Mailbox('Alice 🚀 <test@test.com>'))
    a.set('To', new Mailbox('Bob 🚀 <to@test.com>'))
    a.set('Cc', [new Mailbox('Charlie One 🚀 <cc@test.com>'), new Mailbox('Charlie Two 🚀 <cc2@test.com>')])
    a.set('Bcc', [new Mailbox('Daniel One 🚀 <bcc@test.com>'), new Mailbox('Daniel Two 🚀 <bcc2@test.com>')])
    a.set('Reply-To', new Mailbox('Emily 🚀 <replyto@test.com>'))
    a.set('Subject', 'Testing 🚀')
    a.set('Date', 'Wed, 22 Mar 2023 12:12:02 +0000')
    a.set('Message-ID', '<qjuijvi0ie@test.com>')
    a.set('X-Custom', 'true')
    a.setCustom({name: 'X-Something', value: 'thing'})
    const adump = a.dump()

    expect(a.get('From')).toBeInstanceOf(Mailbox)
    expect(a.get('Subject')).toBe('Testing 🚀')
    expect(adump).toBe(
        'Date: Wed, 22 Mar 2023 12:12:02 +0000' + envctx.eol +
        'From: =?utf-8?B?QWxpY2Ug8J+agA==?= <test@test.com>' + envctx.eol +
        'Reply-To: =?utf-8?B?RW1pbHkg8J+agA==?= <replyto@test.com>' + envctx.eol +
        'To: =?utf-8?B?Qm9iIPCfmoA=?= <to@test.com>' + envctx.eol +
        'Cc: =?utf-8?B?Q2hhcmxpZSBPbmUg8J+agA==?= <cc@test.com>,' + envctx.eol +
        ' =?utf-8?B?Q2hhcmxpZSBUd28g8J+agA==?= <cc2@test.com>' + envctx.eol +
        'Bcc: =?utf-8?B?RGFuaWVsIE9uZSDwn5qA?= <bcc@test.com>,' + envctx.eol +
        ' =?utf-8?B?RGFuaWVsIFR3byDwn5qA?= <bcc2@test.com>' + envctx.eol +
        'Message-ID: <qjuijvi0ie@test.com>' + envctx.eol +
        'Subject: =?utf-8?B?VGVzdGluZyDwn5qA?=' + envctx.eol +
        'MIME-Version: 1.0' + envctx.eol +
        'X-Custom: true' + envctx.eol +
        'X-Something: thing'
    )
    expect(() => a.setCustom('something')).toThrow()
    expect(() => a.setCustom({name: 'something'})).toThrow()
    expect(() => a.set('Sender', 'some')).toThrow()
    expect(() => a.set('From', [new Mailbox('from@test.com'), new Mailbox('from2@test.com')])).toThrow()
})

test('sets and reads headers, skip encoding if all characters qualify', () => {
    const a = new MIMEMessageHeader(envctx, { checkHeaderRequiresBase64: (data) => {
        return !validAWSRegex.test(data); // invalid char found
    }})
    a.set('From', new Mailbox('Alice <test@test.com>'))
    a.set('To', new Mailbox('Bob <to@test.com>'))
    a.set('Cc', [new Mailbox('Charlie One <cc@test.com>'), new Mailbox('Charlie Two <cc2@test.com>')])
    a.set('Bcc', [new Mailbox('Daniel One <bcc@test.com>'), new Mailbox('Daniel Two <bcc2@test.com>')])
    a.set('Reply-To', new Mailbox('Emily <replyto@test.com>'))
    a.set('Subject', 'Testing')
    a.set('Date', 'Wed, 22 Mar 2023 12:12:02 +0000')
    a.set('Message-ID', '<qjuijvi0ie@test.com>')
    a.set('X-Custom', 'true')
    a.setCustom({name: 'X-Something', value: 'thing'})
    const adump = a.dump()

    expect(a.get('From')).toBeInstanceOf(Mailbox)
    expect(a.get('Subject')).toBe('Testing')
    expect(adump).toBe(
        'Date: Wed, 22 Mar 2023 12:12:02 +0000' + envctx.eol +
        'From: Alice <test@test.com>' + envctx.eol +
        'Reply-To: Emily <replyto@test.com>' + envctx.eol +
        'To: Bob <to@test.com>' + envctx.eol +
        'Cc: Charlie One <cc@test.com>,' + envctx.eol +
        ' Charlie Two <cc2@test.com>' + envctx.eol +
        'Bcc: Daniel One <bcc@test.com>,' + envctx.eol +
        ' Daniel Two <bcc2@test.com>' + envctx.eol +
        'Message-ID: <qjuijvi0ie@test.com>' + envctx.eol +
        'Subject: Testing' + envctx.eol +
        'MIME-Version: 1.0' + envctx.eol +
        'X-Custom: true' + envctx.eol +
        'X-Something: thing'
    )
    expect(() => a.setCustom('something')).toThrow()
    expect(() => a.setCustom({name: 'something'})).toThrow()
    expect(() => a.set('Sender', 'some')).toThrow()
    expect(() => a.set('From', [new Mailbox('from@test.com'), new Mailbox('from2@test.com')])).toThrow()
})

test('sets and reads headers, encode base64 if invalid chars detected', () => {
    const a = new MIMEMessageHeader(envctx, { checkHeaderRequiresBase64: (data) => {
        return !validAWSRegex.test(data); // invalid char found
    }})
    a.set('From', new Mailbox('Namespace:Alice <test@test.com>')) // AWS SES does not like unencoded colons in headers
    a.set('To', new Mailbox('Bob 🚀 <to@test.com>'))
    a.set('Cc', [new Mailbox('Charlie One 🚀 <cc@test.com>'), new Mailbox('Charlie Two 🚀 <cc2@test.com>')])
    a.set('Bcc', [new Mailbox('Daniel One 🚀 <bcc@test.com>'), new Mailbox('Daniel Two 🚀 <bcc2@test.com>')])
    a.set('Reply-To', new Mailbox('Emily 🚀 <replyto@test.com>'))
    a.set('Subject', 'Testing 🚀')
    a.set('Date', 'Wed, 22 Mar 2023 12:12:02 +0000')
    a.set('Message-ID', '<qjuijvi0ie@test.com>')
    a.set('X-Custom', 'true')
    a.setCustom({name: 'X-Something', value: 'thing'})
    const adump = a.dump()

    expect(a.get('From')).toBeInstanceOf(Mailbox)
    expect(a.get('Subject')).toBe('Testing 🚀')
    expect(adump).toBe(
        'Date: Wed, 22 Mar 2023 12:12:02 +0000' + envctx.eol +
        'From: =?utf-8?B?TmFtZXNwYWNlOkFsaWNl?= <test@test.com>' + envctx.eol +
        'Reply-To: =?utf-8?B?RW1pbHkg8J+agA==?= <replyto@test.com>' + envctx.eol +
        'To: =?utf-8?B?Qm9iIPCfmoA=?= <to@test.com>' + envctx.eol +
        'Cc: =?utf-8?B?Q2hhcmxpZSBPbmUg8J+agA==?= <cc@test.com>,' + envctx.eol +
        ' =?utf-8?B?Q2hhcmxpZSBUd28g8J+agA==?= <cc2@test.com>' + envctx.eol +
        'Bcc: =?utf-8?B?RGFuaWVsIE9uZSDwn5qA?= <bcc@test.com>,' + envctx.eol +
        ' =?utf-8?B?RGFuaWVsIFR3byDwn5qA?= <bcc2@test.com>' + envctx.eol +
        'Message-ID: <qjuijvi0ie@test.com>' + envctx.eol +
        'Subject: =?utf-8?B?VGVzdGluZyDwn5qA?=' + envctx.eol +
        'MIME-Version: 1.0' + envctx.eol +
        'X-Custom: true' + envctx.eol +
        'X-Something: thing'
    )
    expect(() => a.setCustom('something')).toThrow()
    expect(() => a.setCustom({name: 'something'})).toThrow()
    expect(() => a.set('Sender', 'some')).toThrow()
    expect(() => a.set('From', [new Mailbox('from@test.com'), new Mailbox('from2@test.com')])).toThrow()
})
