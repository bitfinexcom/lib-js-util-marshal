/* eslint-env mocha */

'use strict'

const assert = require('assert')
const loadFloat = require('../src/load.float')

describe('loadFloat tests', () => {
  it('should encode positive float in expected format', () => {
    const val = loadFloat(Buffer.from('0c31322e33343536', 'hex'))
    assert.strictEqual(val, 12.3456)
  })

  it('should encode negative float in expected format', () => {
    const val = loadFloat(Buffer.from('0d2d31322e33343536', 'hex'))
    assert.strictEqual(val, -12.3456)
  })

  it('should encode positive infinity in expected format', () => {
    const val = loadFloat(Buffer.from('08696e66', 'hex'))
    assert.strictEqual(val, Infinity)
  })

  it('should encode negative infinity in expected format', () => {
    const val = loadFloat(Buffer.from('092d696e66', 'hex'))
    assert.strictEqual(val, -Infinity)
  })

  it('should encode NaN in expected format', () => {
    const val = loadFloat(Buffer.from('086e616e', 'hex'))
    assert.strictEqual(val, NaN)
  })

  it('should return accurate length for positive float', () => {
    const { len } = loadFloat(Buffer.from('0c31322e33343536', 'hex'), true)
    assert.strictEqual(len, 8)
  })

  it('should return accurate length for negative float', () => {
    const { len } = loadFloat(Buffer.from('0d2d31322e33343536', 'hex'), true)
    assert.strictEqual(len, 9)
  })

  it('should return accurate length for positive infinity', () => {
    const { len } = loadFloat(Buffer.from('08696e66', 'hex'), true)
    assert.strictEqual(len, 4)
  })

  it('should return accurate length for negative infinity', () => {
    const { len } = loadFloat(Buffer.from('092d696e66', 'hex'), true)
    assert.strictEqual(len, 5)
  })

  it('should return accurate length for NaN', () => {
    const { len } = loadFloat(Buffer.from('086e616e', 'hex'), true)
    assert.strictEqual(len, 4)
  })
})
