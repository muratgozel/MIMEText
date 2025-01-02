import {expect, test} from '@jest/globals'
import {Mailbox} from "../src/Mailbox.js";

const input1 = 'test@mail.com'
const input2 = 'Test Lorem Ipsum <test@mail.com>'
const input3 = {addr: 'test@mail.com', name: 'Test Lorem Ipsum', type: 'From'}

test('it accepts objects and texts in a certain format.', () => {
    const mail = new Mailbox(input1)
    expect(mail.addr).toBe(input1)
    expect(mail.name).toBe('')
    expect(mail.type).toBe('To')

    const mail2 = new Mailbox(input2)
    expect(mail2.addr).toBe('test@mail.com')
    expect(mail2.name).toBe('Test Lorem Ipsum')
    expect(mail2.type).toBe('To')

    const mail3 = new Mailbox(input3)
    expect(mail3.addr).toBe('test@mail.com')
    expect(mail3.name).toBe('Test Lorem Ipsum')
    expect(mail3.type).toBe('From')
})

test('gets domain part of the address', () => {
    expect(new Mailbox('test@mail.com').getAddrDomain()).toBe('mail.com')
})

test('dumps address', () => {
    expect(new Mailbox(input1).dump()).toBe('<test@mail.com>')
    expect(new Mailbox(input2).dump()).toBe('"Test Lorem Ipsum" <test@mail.com>')
    expect(new Mailbox(input3).dump()).toBe('"Test Lorem Ipsum" <test@mail.com>')
})