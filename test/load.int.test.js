/* eslint-env mocha */

'use strict'

const assert = require('assert')
const loadInt = require('../src/load.int')

describe('loadInt tests', () => {
  it('should return expected format for zero', () => {
    const val = loadInt(Buffer.from('00', 'hex'))
    assert.strictEqual(val, 0)
  })

  it('should return expected format for short positive ints', () => {
    const val1 = loadInt(Buffer.from('06', 'hex'))
    assert.strictEqual(val1, 1)

    const val2 = loadInt(Buffer.from('07', 'hex'))
    assert.strictEqual(val2, 2)

    const val3 = loadInt(Buffer.from('7f', 'hex'))
    assert.strictEqual(val3, 122)
  })

  it('should return expected format for short negative ints', () => {
    const val1 = loadInt(Buffer.from('fa', 'hex'))
    assert.strictEqual(val1, -1)

    const val2 = loadInt(Buffer.from('f9', 'hex'))
    assert.strictEqual(val2, -2)

    const val3 = loadInt(Buffer.from('80', 'hex'))
    assert.strictEqual(val3, -123)
  })

  it('should return expected format for 2 byte positive ints', () => {
    const val1 = loadInt(Buffer.from('017b', 'hex'))
    assert.strictEqual(val1, 123)

    const val2 = loadInt(Buffer.from('01ff', 'hex'))
    assert.strictEqual(val2, 255)
  })

  it('should return expected format for 2 byte negative ints', () => {
    const val1 = loadInt(Buffer.from('ff84', 'hex'))
    assert.strictEqual(val1, -124)

    const val2 = loadInt(Buffer.from('ff00', 'hex'))
    assert.strictEqual(val2, -256)
  })

  it('should return expected format for 3 byte positive ints', () => {
    const val1 = loadInt(Buffer.from('020001', 'hex'))
    assert.strictEqual(val1, 256)

    const val2 = loadInt(Buffer.from('02ffff', 'hex'))
    assert.strictEqual(val2, 65535)
  })

  it('should return expected format for 3 byte negative ints', () => {
    const val1 = loadInt(Buffer.from('fefffe', 'hex'))
    assert.strictEqual(val1, -257)

    const val2 = loadInt(Buffer.from('fe0000', 'hex'))
    assert.strictEqual(val2, -65536)
  })

  it('should return expected format for 4 byte positive ints', () => {
    const val1 = loadInt(Buffer.from('03000001', 'hex'))
    assert.strictEqual(val1, 65536)

    const val2 = loadInt(Buffer.from('03ffffff', 'hex'))
    assert.strictEqual(val2, 16777215)
  })

  it('should return expected format for 4 byte negative ints', () => {
    const val1 = loadInt(Buffer.from('fdfffffe', 'hex'))
    assert.strictEqual(val1, -65537)

    const val2 = loadInt(Buffer.from('fd000000', 'hex'))
    assert.strictEqual(val2, -16777216)
  })

  it('should return expected format for 5 byte positive ints', () => {
    const val1 = loadInt(Buffer.from('0400000001', 'hex'))
    assert.strictEqual(val1, 16777216)

    const val2 = loadInt(Buffer.from('04ffffff3f', 'hex'))
    assert.strictEqual(val2, 2 ** 30 - 1)
  })

  it('should return expected format for 5 byte positive ints', () => {
    const val1 = loadInt(Buffer.from('fcfffffffe', 'hex'))
    assert.strictEqual(val1, -16777217)

    const val2 = loadInt(Buffer.from('fc000000c0', 'hex'))
    assert.strictEqual(val2, -(2 ** 30))
  })

  it('should return expected length for zero', () => {
    const { len } = loadInt(Buffer.from('00', 'hex'), true)
    assert.strictEqual(len, 1)
  })

  it('should return expected length for short positive ints', () => {
    const { len: len1 } = loadInt(Buffer.from('06', 'hex'), true)
    assert.strictEqual(len1, 1)

    const { len: len2 } = loadInt(Buffer.from('7f', 'hex'), true)
    assert.strictEqual(len2, 1)
  })

  it('should return expected length for short negative ints', () => {
    const { len: len1 } = loadInt(Buffer.from('fa', 'hex'), true)
    assert.strictEqual(len1, 1)

    const { len: len2 } = loadInt(Buffer.from('80', 'hex'), true)
    assert.strictEqual(len2, 1)
  })

  it('should return expected length for 2 byte positive ints', () => {
    const { len: len1 } = loadInt(Buffer.from('017b', 'hex'), true)
    assert.strictEqual(len1, 2)

    const { len: len2 } = loadInt(Buffer.from('01ff', 'hex'), true)
    assert.strictEqual(len2, 2)
  })

  it('should return expected length for 2 byte negative ints', () => {
    const { len: len1 } = loadInt(Buffer.from('ff84', 'hex'), true)
    assert.strictEqual(len1, 2)

    const { len: len2 } = loadInt(Buffer.from('ff00', 'hex'), true)
    assert.strictEqual(len2, 2)
  })

  it('should return expected length for 3 byte positive ints', () => {
    const { len: len1 } = loadInt(Buffer.from('020001', 'hex'), true)
    assert.strictEqual(len1, 3)

    const { len: len2 } = loadInt(Buffer.from('02ffff', 'hex'), true)
    assert.strictEqual(len2, 3)
  })

  it('should return expected length for 3 byte negative ints', () => {
    const { len: len1 } = loadInt(Buffer.from('fefffe', 'hex'), true)
    assert.strictEqual(len1, 3)

    const { len: len2 } = loadInt(Buffer.from('fe0000', 'hex'), true)
    assert.strictEqual(len2, 3)
  })

  it('should return expected length for 4 byte positive ints', () => {
    const { len: len1 } = loadInt(Buffer.from('03000001', 'hex'), true)
    assert.strictEqual(len1, 4)

    const { len: len2 } = loadInt(Buffer.from('03ffffff', 'hex'), true)
    assert.strictEqual(len2, 4)
  })

  it('should return expected length for 4 byte negative ints', () => {
    const { len: len1 } = loadInt(Buffer.from('fdfffffe', 'hex'), true)
    assert.strictEqual(len1, 4)

    const { len: len2 } = loadInt(Buffer.from('fd000000', 'hex'), true)
    assert.strictEqual(len2, 4)
  })

  it('should return expected length for 5 byte positive ints', () => {
    const { len: len1 } = loadInt(Buffer.from('0400000001', 'hex'), true)
    assert.strictEqual(len1, 5)

    const { len: len2 } = loadInt(Buffer.from('04ffffff3f', 'hex'), true)
    assert.strictEqual(len2, 5)
  })

  it('should return expected length for 5 byte positive ints', () => {
    const { len: len1 } = loadInt(Buffer.from('fcfffffffe', 'hex'), true)
    assert.strictEqual(len1, 5)

    const { len: len2 } = loadInt(Buffer.from('fc000000c0', 'hex'), true)
    assert.strictEqual(len2, 5)
  })
})
