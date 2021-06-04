/* eslint-env mocha */

'use strict'

const assert = require('assert')
const { loadIVAR } = require('../src/load.complex')

describe('loadIVAR tests', () => {
  it('should decode strings', () => {
    const val = loadIVAR(Buffer.from('220a68656c6c6f063a064554', 'hex'), [])
    assert.strictEqual(val, 'hello')
  })

  it('should decode large strings', () => {
    const val = loadIVAR(Buffer.from('22022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162063a064554', 'hex'), [])
    assert.strictEqual(val, 'baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab')
  })

  it('should decode empty strings', () => {
    const val = loadIVAR(Buffer.from('2200063a064554', 'hex'), [])
    assert.strictEqual(val, '')
  })

  it('should support different encodings', () => {
    const utf8 = loadIVAR(Buffer.from('220a68656c6c6f063a064554', 'hex'), [])
    const usascii = loadIVAR(Buffer.from('220a68656c6c6f063a064546', 'hex'), [])
    const utf16le = loadIVAR(Buffer.from('220f680065006c006c006f00063a0d656e636f64696e67220d5554462d31364c45', 'hex'), [])
    const iso88591 = loadIVAR(Buffer.from('220a68656c6c6f063a0d656e636f64696e67220f49534f2d383835392d31', 'hex'), [])

    assert.strictEqual(utf8, 'hello')
    assert.strictEqual(usascii, 'hello')
    assert.strictEqual(utf16le, 'hello')
    assert.strictEqual(iso88591, 'hello')
  })

  it('should throw on unsupported encoding in nodejs', () => {
    assert.throws(
      () => loadIVAR(Buffer.from('220a68656c6c6f063a0d656e636f64696e67220e53686966745f4a4953', 'hex'), []),
      new Error('ERR_MARSHAL_STR_ENCODING_NOT_SUPPORTED')
    )
  })

  it('should return expected length for strings', () => {
    const { len } = loadIVAR(Buffer.from('220a68656c6c6f063a064554', 'hex'), [], true)
    assert.strictEqual(len, 12)
  })

  it('should return expected length for large strings', () => {
    const { len } = loadIVAR(Buffer.from('22022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162063a064554', 'hex'), [], true)
    assert.strictEqual(len, 311)
  })

  it('should return expected length for empty string', () => {
    const { len } = loadIVAR(Buffer.from('2200063a064554', 'hex'), [], true)
    assert.strictEqual(len, 7)
  })

  it('should return expected length for different string encodings', () => {
    const { len: utf8 } = loadIVAR(Buffer.from('220a68656c6c6f063a064554', 'hex'), [], true)
    const { len: usascii } = loadIVAR(Buffer.from('220a68656c6c6f063a064546', 'hex'), [], true)
    const { len: utf16le } = loadIVAR(Buffer.from('220f680065006c006c006f00063a0d656e636f64696e67220d5554462d31364c45', 'hex'), [], true)
    const { len: iso88591 } = loadIVAR(Buffer.from('220a68656c6c6f063a0d656e636f64696e67220f49534f2d383835392d31', 'hex'), [], true)

    assert.strictEqual(utf8, 12)
    assert.strictEqual(usascii, 12)
    assert.strictEqual(utf16le, 33)
    assert.strictEqual(iso88591, 30)
  })
})
