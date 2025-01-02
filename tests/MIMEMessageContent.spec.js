import {EOL} from 'node:os'
import {expect, test} from '@jest/globals'
import * as mime from 'mime-types'
import {MIMEMessageContent} from '../src/entrypoints/node.js'

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
        return mime.lookup(v)
    }
}
const sampleImageBase64 = '/9j/4AAQSkZJRgABAgEASABIAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA//AABEIAAUABQMAEQABEQECEQH/xABPAAEAAAAAAAAAAAAAAAAAAAAKEAEBAQEBAQAAAAAAAAAAAAAFBgQDAgEBAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwAAARECEQA/AHsDDIlo1m7dWUFHmo6DMyOOzmleB0EdwlZme6ycn1npkJbZP7FgtTvTo7qaV+KtbefPb4N8Hn4A/9k='

test('plain text content', () => {
    const content = new MIMEMessageContent(envctx, 'hello there', {'Content-Type': 'plain/text'})
    expect(content.isAttachment()).toBe(false)
    expect(content.getHeader('Content-Type')).toBe('plain/text')
    expect(content.dump({mixed: 'abcdef', alt: 'ghjklm'})).toBe(
        'Content-Type: plain/text' + envctx.eol + envctx.eol +
            'hello there'
    )
})

test('base64 encoded image attachment', () => {
    const content = new MIMEMessageContent(envctx, sampleImageBase64, {
        'Content-Type': 'image/jpg; charset=UTF-8',
        'Content-Transfer-Encoding': 'base64',
        'Content-Disposition': 'attachment;filename="sample.jpg"'
    })
    expect(content.isAttachment()).toBe(true)
    expect(content.getHeader('Content-Type')).toBe('image/jpg; charset=UTF-8')
    expect(content.dump()).toBe(
        'Content-Type: image/jpg; charset=UTF-8' + envctx.eol +
        'Content-Transfer-Encoding: base64' + envctx.eol +
        'Content-Disposition: attachment;filename="sample.jpg"' + envctx.eol + envctx.eol +
        sampleImageBase64
    )
})

test('image attachment and inline attachment together', () => {
    const content = new MIMEMessageContent(envctx, sampleImageBase64, {
        'Content-Type': 'image/jpg; charset=UTF-8',
        'Content-Transfer-Encoding': 'base64',
        'Content-Disposition': 'inline;filename="sample.jpg"'
    })
    expect(content.isInlineAttachment()).toBe(true)
    expect(content.getHeader('Content-Type')).toBe('image/jpg; charset=UTF-8')
    expect(content.dump()).toBe(
        'Content-Type: image/jpg; charset=UTF-8' + envctx.eol +
        'Content-Transfer-Encoding: base64' + envctx.eol +
        'Content-Disposition: inline;filename="sample.jpg"' + envctx.eol + envctx.eol +
        sampleImageBase64
    )
})