/* eslint-env mocha */

'use strict'

const assert = require('assert')
const dumpBool = require('../src/dump.bool')

describe('dumpBool tests', () => {
  it('should return expected format for true', () => {
    const d = dumpBool(true)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '54')
  })

  it('should return expected format for false', () => {
    const d = dumpBool(false)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '46')
  })
})
