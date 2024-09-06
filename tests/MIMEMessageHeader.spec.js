import {EOL} from 'node:os'
import {expect, test} from '@jest/globals'
import * as mime from 'mime-types'
import {MIMEMessageHeader, Mailbox} from '../dist/node.js'

const _reLineSplit = /\r\n|(?!\r\n)[\n-\r\x85\u2028\u2029]/
const envctx = {
    toBase64: function toBase64(data) {
        return (new Buffer(data)).toString('base64')
    },
    toBase64WebSafe: function toBase64WebSafe(data) {
    return new Buffer(data)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    },
    eol: EOL,
    validateContentType: (v) => {
        return mime.lookup(v)
    }
}

test('header fields', () => {
    const a = new MIMEMessageHeader(envctx)
    expect(a.isHeaderField({})).toBe(false)
    expect(a.isHeaderField({value: 1})).toBe(false)
    expect(a.isHeaderField({name: 'x-header'})).toBe(true)
    expect(a.isHeaderField({name: 'x-header', invalidProp: true})).toBe(false)
    expect(a.isHeaderField({name: 'x-header', value: 1, dump: '', required: true, disabled: true, generator: '', custom: ''})).toBe(true)
})

test('exports heade fields as object', () => {
    const a = new MIMEMessageHeader(envctx)
    const obj = a.toObject()
    expect(obj.Date).toBe(undefined)
    expect(obj.Subject).toBe(undefined)
})

test('sets and reads headers, skip encoding pure ASCII values', () => {
    const envctx2 = {
        ...envctx,
        skipEncodingPureAsciiHeaders: true,
    }
    const a = new MIMEMessageHeader(envctx2, { skipEncodingPureAsciiHeaders: true })
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

test('sets and reads headers with encoded unicode values', () => {
    const a = new MIMEMessageHeader(envctx, { skipEncodingPureAsciiHeaders: false })
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