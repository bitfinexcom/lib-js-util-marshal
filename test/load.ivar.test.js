'use strict'

const test = require('brittle')
const { loadIVAR } = require('../src/load.complex')

test('loadIVAR tests - should decode strings', (t) => {
  const val = loadIVAR(Buffer.from('220a68656c6c6f063a064554', 'hex'), [])
  t.is(val, 'hello')
})

test('loadIVAR tests - should decode large strings', (t) => {
  const val = loadIVAR(Buffer.from('22022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162063a064554', 'hex'), [])
  t.is(val, 'baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab')
})

test('loadIVAR tests - should decode empty strings', (t) => {
  const val = loadIVAR(Buffer.from('2200063a064554', 'hex'), [])
  t.is(val, '')
})

test('loadIVAR tests - should support different encodings', (t) => {
  const utf8 = loadIVAR(Buffer.from('220a68656c6c6f063a064554', 'hex'), [])
  const usascii = loadIVAR(Buffer.from('220a68656c6c6f063a064546', 'hex'), [])
  const utf16le = loadIVAR(Buffer.from('220f680065006c006c006f00063a0d656e636f64696e67220d5554462d31364c45', 'hex'), [])
  const iso88591 = loadIVAR(Buffer.from('220a68656c6c6f063a0d656e636f64696e67220f49534f2d383835392d31', 'hex'), [])

  t.is(utf8, 'hello')
  t.is(usascii, 'hello')
  t.is(utf16le, 'hello')
  t.is(iso88591, 'hello')
})

test('loadIVAR tests - should throw on unsupported encoding in nodejs', (t) => {
  t.exception(() => loadIVAR(Buffer.from('220a68656c6c6f063a0d656e636f64696e67220e53686966745f4a4953', 'hex'), []), /ERR_MARSHAL_STR_ENCODING_NOT_SUPPORTED/)
})

test('loadIVAR tests - should return expected length for strings', (t) => {
  const { len } = loadIVAR(Buffer.from('220a68656c6c6f063a064554', 'hex'), [], true)
  t.is(len, 12)
})

test('loadIVAR tests - should return expected length for large strings', (t) => {
  const { len } = loadIVAR(Buffer.from('22022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162063a064554', 'hex'), [], true)
  t.is(len, 311)
})

test('loadIVAR tests - should return expected length for empty string', (t) => {
  const { len } = loadIVAR(Buffer.from('2200063a064554', 'hex'), [], true)
  t.is(len, 7)
})

test('loadIVAR tests - should return expected length for different string encodings', (t) => {
  const { len: utf8 } = loadIVAR(Buffer.from('220a68656c6c6f063a064554', 'hex'), [], true)
  const { len: usascii } = loadIVAR(Buffer.from('220a68656c6c6f063a064546', 'hex'), [], true)
  const { len: utf16le } = loadIVAR(Buffer.from('220f680065006c006c006f00063a0d656e636f64696e67220d5554462d31364c45', 'hex'), [], true)
  const { len: iso88591 } = loadIVAR(Buffer.from('220a68656c6c6f063a0d656e636f64696e67220f49534f2d383835392d31', 'hex'), [], true)

  t.is(utf8, 12)
  t.is(usascii, 12)
  t.is(utf16le, 33)
  t.is(iso88591, 30)
})
