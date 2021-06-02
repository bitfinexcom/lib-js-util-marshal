'use strict'

const { inspect } = require('util')
const marshal = require('../index')

const myObj = {
  foo: 'bar',
  1: true,
  data: [
    'a', null, false, -3.14,
    [1, 2, { name: 'joe' }]
  ]
}

const serialized = marshal.dump(myObj).toString('hex')
console.log(serialized)
/* prints
0408 7b08 3a06 3154 3a08 666f 6f22 0862 6172 3a09 6461 7461 5b0a 2206 6130
4666 0a2d 332e 3134 5b08 6906 6907 7b06 3a09 6e61 6d65 2208 6a6f 65
*/

const deserialized = marshal.load(Buffer.from(serialized, 'hex'))
console.log(inspect(deserialized, false, 10, true))
/* prints
{
  '1': true,
  foo: 'bar',
  data: [ 'a', null, false, -3.14, [ 1, 2, { name: 'joe' } ] ]
}
*/
