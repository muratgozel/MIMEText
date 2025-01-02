import {EOL} from 'node:os'
import { Buffer } from 'node:buffer'
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import {expect, test, beforeAll, jest} from '@jest/globals'
import {createMimeMessage} from '../src/entrypoints/node.js'

const sampleImageBase64 = '/9j/4AAQSkZJRgABAgEASABIAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA//AABEIAAUABQMAEQABEQECEQH/xABPAAEAAAAAAAAAAAAAAAAAAAAKEAEBAQEBAQAAAAAAAAAAAAAFBgQDAgEBAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwAAARECEQA/AHsDDIlo1m7dWUFHmo6DMyOOzmleB0EdwlZme6ycn1npkJbZP7FgtTvTo7qaV+KtbefPb4N8Hn4A/9k='
const sampleTxtBase64 = 'SGVsbG8gdGhlcmUu'
const dotsBase64 = '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'
const reddotsBase64 = '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'

beforeAll(() => {
    const requiredEnvVars = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'FROM', 'TO']
    for (const envvar of requiredEnvVars) {
        if (typeof process.env[envvar] === undefined) {
            throw new Error('The env variable "' + envvar + '" must be set.')
        }
    }
})

test('sends a plain text email to the specified recipients', async () => {
    const ses = new SESClient({region: process.env.AWS_REGION})
    const msg = createMimeMessage()
    //const spyAsRawMessage = jest.spyOn(msg, 'asRawMessage')
    msg.setSender(process.env.FROM)
    msg.setRecipients(process.env.TO.split(','))
    msg.setSubject('Testing MimeText 🐬 (Plain Text)')
    msg.addMessage({
        contentType: 'text/plain',
        data: 'Hello there,' + EOL + EOL +
            'This is a test email sent by MimeText test suite.'
    })

    const params = {
        Source: msg.getSender().addr,
        Destinations: msg.getRecipients().map((box) => box.addr),
        RawMessage: {
            Data: Buffer.from(msg.asRaw(), 'utf8')
        }
    }
    //expect(spyAsRawMessage).toHaveBeenCalled()
    const result = await ses.send(new SendRawEmailCommand(params))
    expect(result).toHaveProperty('MessageId')
    expect(typeof result.MessageId).toBe('string')
    expect(result.MessageId.length).toBeGreaterThan(1)
})

test('sends an html email with an image attachment', async () => {
    const ses = new SESClient({region: process.env.AWS_REGION})
    const msg = createMimeMessage()
    msg.setSender(process.env.FROM)
    msg.setRecipients(process.env.TO.split(','))
    msg.setSubject('Testing MimeText 🐬 (HTML With An Attachment)')
    msg.addMessage({
        contentType: 'text/html',
        data: 'Hello there,<br><br>' +
            'This is a test email sent by <b>MimeText</b> test suite.<br><br>' +
            'There should be an attachment in this email called dots.jpg<br><br>' +
            'Best regards.'
    })
    msg.addAttachment({
        filename: 'dots.jpg',
        contentType: 'image/jpg',
        data: dotsBase64
    })

    const params = {
        Source: msg.getSender().addr,
        Destinations: msg.getRecipients().map((box) => box.addr),
        RawMessage: {
            Data: Buffer.from(msg.asRaw(), 'utf8')
        }
    }
    const result = await ses.send(new SendRawEmailCommand(params))
    expect(result).toHaveProperty('MessageId')
    expect(typeof result.MessageId).toBe('string')
    expect(result.MessageId.length).toBeGreaterThan(1)
})

test('sends an html email with inline attachments', async () => {
    const ses = new SESClient({region: process.env.AWS_REGION})
    const msg = createMimeMessage()
    msg.setSender(process.env.FROM)
    msg.setRecipients(process.env.TO.split(','))
    msg.setSubject('Testing MimeText 🐬 (HTML With Inline Attachments)')
    msg.addAttachment({
        inline: true,
        filename: 'dots.jpg',
        contentType: 'image/jpg',
        data: dotsBase64,
        headers: {'Content-ID': 'dots123456'}
    })
    msg.addAttachment({
        inline: true,
        filename: 'reddots.jpg',
        contentType: 'image/jpg',
        data: reddotsBase64,
        headers: {'Content-ID': 'red123456'}
    })
    msg.addMessage({
        contentType: 'text/html',
        data: 'Hello there,<br><br>' +
            'This is a test email sent by <b>MimeText</b> test suite.<br><br>' +
            'The term MimeText above supposed to be bold. Are you able to see it?<br><br>' +
            'Below, there should be a small image that contains little black dots:<br><br>' +
            '<img src="cid:dots123456"><br><br>' +
            'Below, there should be a small image that contains little red dots:<br><br>' +
            '<img src="cid:red123456"><br><br>' +
            'Best regards.'
    })

    const params = {
        Source: msg.getSender().addr,
        Destinations: msg.getRecipients().map((box) => box.addr),
        RawMessage: {
            Data: Buffer.from(msg.asRaw(), 'utf8')
        }
    }
    const result = await ses.send(new SendRawEmailCommand(params))
    expect(result).toHaveProperty('MessageId')
    expect(typeof result.MessageId).toBe('string')
    expect(result.MessageId.length).toBeGreaterThan(1)
})

test('sends a plain text and html mixed email with inline and multiple attachments', async () => {
    const ses = new SESClient({region: process.env.AWS_REGION})
    const msg = createMimeMessage()
    //const spyAsRawRelatedMixedAlt = jest.spyOn(msg, 'asRawRelatedMixedAlt')
    msg.setSender(process.env.FROM)
    msg.setRecipients(process.env.TO.split(','))
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
            '<img src="cid:dots123456"><br><br>' +
            'Best regards.'
    })
    msg.addAttachment({
        filename: 'sample.jpg',
        contentType: 'image/jpg',
        data: sampleImageBase64
    })
    msg.addAttachment({
        filename: 'sample.txt',
        contentType: 'text/plain',
        data: sampleTxtBase64
    })
    msg.addAttachment({
        inline: true,
        filename: 'dots.jpg',
        contentType: 'image/jpg',
        data: dotsBase64,
        headers: {'Content-ID': 'dots123456'}
    })

    const params = {
        Source: msg.getSender().addr,
        Destinations: msg.getRecipients().map((box) => box.addr),
        RawMessage: {
            Data: Buffer.from(msg.asRaw(), 'utf8')
        }
    }
    //expect(spyAsRawRelatedMixedAlt).toHaveBeenCalled()
    const result = await ses.send(new SendRawEmailCommand(params))
    expect(result).toHaveProperty('MessageId')
    expect(typeof result.MessageId).toBe('string')
    expect(result.MessageId.length).toBeGreaterThan(1)
})

test('sends an email using aws-sdk v2', async () => {
    const ses = new SESv2Client({region: process.env.AWS_REGION})
    const msg = createMimeMessage()
    //const spyAsRawMessage = jest.spyOn(msg, 'asRawMessage')
    msg.setSender(process.env.FROM)
    msg.setRecipients(process.env.TO.split(','))
    msg.setSubject('Testing MimeText 🐬 (Using AWS SDK v2)')
    msg.addMessage({
        contentType: 'text/plain',
        data: 'Hello there,' + EOL + EOL +
            'This is a test email sent by MimeText test suite.'
    })
    msg.addAttachment({
        filename: 'simple.txt',
        contentType: 'text/plain',
        data: Buffer.from('Hello there!', 'utf8').toString('base64')
    })
    const params = {
        FromEmailAddress: msg.getSender().addr,
        Destination: {
            ToAddresses: msg.getRecipients().map((box) => box.addr)
        },
        Content: {
            Raw: {
                Data: Buffer.from(msg.asRaw(), 'utf8')
            }
        }
    }
    const result = await ses.send(new SendEmailCommand(params))
    expect(result).toHaveProperty('MessageId')
    expect(typeof result.MessageId).toBe('string')
    expect(result.MessageId.length).toBeGreaterThan(1)
})

test('sends an html email with plain text attachment using aws-sdk v2', async () => {
    const ses = new SESv2Client({region: process.env.AWS_REGION})
    const msg = createMimeMessage()
    msg.setSender(process.env.FROM)
    msg.setRecipients(process.env.TO.split(','))
    msg.setSubject('Testing MimeText 🐬 (HTML + Plain Text Attachment Using AWS SDK v2)')
    msg.addAttachment({
        filename: 'plain.txt',
        contentType: 'text/plain',
        data: sampleTxtBase64
    })
    msg.addMessage({
        contentType: 'text/html',
        data: 'Hello there,<br><br>' +
            'This is a test email sent by <b>MimeText</b> test suite.<br><br>' +
            'There should be a plain text attachment in this email called plain.txt<br><br>' +
            'Best regards.'
    })
    const params = {
        FromEmailAddress: msg.getSender().addr,
        Destination: {
            ToAddresses: msg.getRecipients().map((box) => box.addr)
        },
        Content: {
            Raw: {
                Data: Buffer.from(msg.asRaw(), 'utf8')
            }
        }
    }
    const result = await ses.send(new SendEmailCommand(params))
    expect(result).toHaveProperty('MessageId')
    expect(typeof result.MessageId).toBe('string')
    expect(result.MessageId.length).toBeGreaterThan(1)
})

test('sends an plain text email with a plain text attachment using aws-sdk v2', async () => {
    const ses = new SESv2Client({region: process.env.AWS_REGION})
    const msg = createMimeMessage()
    msg.setSender(process.env.FROM)
    msg.setRecipients(process.env.TO.split(','))
    msg.setSubject('Testing MimeText 🐬 (Plain Text Message + Plain Text Attachment Using AWS SDK v2)')
    msg.addAttachment({
        filename: 'plain.txt',
        contentType: 'text/plain',
        data: sampleTxtBase64
    })
    msg.addMessage({
        contentType: 'text/plain',
        data: 'Hello there,\n\n' +
            'This is a test email sent by MimeText test suite.\n\n' +
            'There should be a plain text attachment in this email called plain.txt\n\n' +
            'Best regards.'
    })
    const params = {
        FromEmailAddress: msg.getSender().addr,
        Destination: {
            ToAddresses: msg.getRecipients().map((box) => box.addr)
        },
        Content: {
            Raw: {
                Data: Buffer.from(msg.asRaw(), 'utf8')
            }
        }
    }
    const result = await ses.send(new SendEmailCommand(params))
    expect(result).toHaveProperty('MessageId')
    expect(typeof result.MessageId).toBe('string')
    expect(result.MessageId.length).toBeGreaterThan(1)
})
