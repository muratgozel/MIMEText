const assert = require('assert/strict')
const lib = require('../src')

lib.setSender('person@test.com')
lib.setRecipient('person2@test.com')
lib.setRecipient({name: 'Person3 Name', addr: 'person3@test.com'}, {cc: true})
lib.setRecipient({name: 'Person4 Name', addr: 'person4@test.com'}, {bcc: true})
lib.setSubject('Selam!')
lib.setMessage('Lorem ipsum <b>me!</b>.', 'text/html')

console.log(lib.asRaw())
