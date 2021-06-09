/* eslint-env mocha */

'use strict'

const assert = require('assert')
const dumpNull = require('../src/dump.null')

describe('dumpNull tests', () => {
  it('should return expected format', () => {
    const d = dumpNull()
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '30')
  })
})
