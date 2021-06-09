/* eslint-env mocha */

'use strict'

const assert = require('assert')
const loadString = require('../src/load.string')
const { STR_ENCODINGS } = require('../src/constants')

describe('loadString tests', () => {
  it('should decode strings', () => {
    const val = loadString(Buffer.from('0a68656c6c6f', 'hex'))
    assert.strictEqual(val, 'hello')
  })

  it('should decode large strings', () => {
    const val = loadString(Buffer.from('022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162', 'hex'))
    assert.strictEqual(val, 'baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab')
  })

  it('should decode empty strings', () => {
    const val = loadString(Buffer.from('00', 'hex'))
    assert.strictEqual(val, '')
  })

  it('should support different encodings', () => {
    const utf8 = loadString(Buffer.from('0a68656c6c6f', 'hex'), false, STR_ENCODINGS['UTF-8'])
    const usascii = loadString(Buffer.from('0a68656c6c6f', 'hex'), false, STR_ENCODINGS['US-ASCII'])
    const utf16le = loadString(Buffer.from('0f680065006c006c006f00', 'hex'), false, STR_ENCODINGS['UTF-16LE'])
    const iso88591 = loadString(Buffer.from('0a68656c6c6f', 'hex'), false, STR_ENCODINGS['ISO-8859-1'])

    assert.strictEqual(utf8, 'hello')
    assert.strictEqual(usascii, 'hello')
    assert.strictEqual(utf16le, 'hello')
    assert.strictEqual(iso88591, 'hello')
  })

  it('should return expected length for strings', () => {
    const { len } = loadString(Buffer.from('0a68656c6c6f', 'hex'), true)
    assert.strictEqual(len, 6)
  })

  it('should return expected length for large strings', () => {
    const { len } = loadString(Buffer.from('022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162', 'hex'), true)
    assert.strictEqual(len, 305)
  })

  it('should return expected length for empty string', () => {
    const { len } = loadString(Buffer.from('00', 'hex'), true)
    assert.strictEqual(len, 1)
  })

  it('should return expected length for different string encodings', () => {
    const { len: utf8 } = loadString(Buffer.from('0a68656c6c6f', 'hex'), true, STR_ENCODINGS['UTF-8'])
    const { len: usascii } = loadString(Buffer.from('0a68656c6c6f', 'hex'), true, STR_ENCODINGS['US-ASCII'])
    const { len: utf16le } = loadString(Buffer.from('0f680065006c006c006f00', 'hex'), true, STR_ENCODINGS['UTF-16LE'])
    const { len: iso88591 } = loadString(Buffer.from('0a68656c6c6f', 'hex'), true, STR_ENCODINGS['ISO-8859-1'])

    assert.strictEqual(utf8, 6)
    assert.strictEqual(usascii, 6)
    assert.strictEqual(utf16le, 11)
    assert.strictEqual(iso88591, 6)
  })
})
