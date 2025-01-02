import {expect, test} from '@jest/globals'
import {MIMETextError} from '../src/entrypoints/node.js'

test('is an instance of native error class', () => {
    const a = new MIMETextError('test error.')
    expect(a).toBeInstanceOf(Error)
})

test('takes message and description as arguments', () => {
    const a = new MIMETextError('test1')
    expect(a.name).toBe('test1')

    const b = new MIMETextError('test2', 'description')
    expect(b.name).toBe('test2')
    expect(b.message).toBe('description')
})