# lib-js-util-marshal

Simple library for serializing and deserializing Ruby's Marshal byte sequences
in NodeJS.

**Supported features**
- dumping integers
- dumping raw strings (ivar strings don't exist in js so raw strings are encoded in utf-8)
- dumping floats (1.0 is dumped as int type due to NodeJS number type)
- dumping nil values (null and undefined)
- dumping boolean values
- dumping symbols (js symbols are converted to ruby symbols)
- dumping symbol links (each js symbol is converted to symbol link when necessary)
- dumping arrays
- dumping hashes
- loading integers
- loading raw strings
- loading ivar strings
- loading floats (1.0 is loaded as int type due to NodeJS number type)
- loading nil values (are converted to null on js)
- loading boolean values
- loading symbols (in js are converted to strings)
- loading symbol links (in js are converted to strings)
- loading arrays
- loading hashes

**Unsupported features**
- bumping/loading bignums
- bumping/loading objects
- bumping/loading object links
- bumping/loading classes
- bumping/loading modules
- bumping/loading regular expressions
- and bumping/loading [other types](https://github.com/ruby/ruby/blob/master/marshal.c#L71)

## Installing

```console
npm install @bitfinex/lib-js-util-marshal
```

## Testing

```console
npm test
```

## Usage

```javascript
'use strict'

const { inspect } = require('util')
const marshal = require('@bitfinex/lib-js-util-marshal')

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

```

## Notes

Detailed info on how object marshaling works in ruby can be found this 
[blog series](http://jakegoulding.com/blog/2013/01/15/a-little-dip-into-rubys-marshal-format/).
