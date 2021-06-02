/* eslint-env mocha */

'use strict'

const assert = require('assert')
const dumpFloat = require('../src/dump.float')

describe('dumpFloat tests', () => {
  it('should encode positive float in expected format', () => {
    const d = dumpFloat(12.3456)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '660c31322e33343536')
  })

  it('should encode negative float in expected format', () => {
    const d = dumpFloat(-12.3456)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '660d2d31322e33343536')
  })

  it('should encode positive infinity in expected format', () => {
    const d = dumpFloat(Infinity)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '6608696e66')
  })

  it('should encode negative infinity in expected format', () => {
    const d = dumpFloat(-Infinity)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '66092d696e66')
  })

  it('should encode NaN in expected format', () => {
    const d = dumpFloat(NaN)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '66086e616e')
  })
})
