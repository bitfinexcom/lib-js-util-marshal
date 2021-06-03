/* eslint-env mocha */

'use strict'

const assert = require('assert')
const dumpSymbol = require('../src/dump.symbol')

describe('dumpSymbol tests', () => {
  it('should encode string in expected format', () => {
    const d = dumpSymbol('hello')
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '3a0a68656c6c6f')
  })

  it('should encode large string in expected format', () => {
    const d = dumpSymbol('baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab')
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '3a022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162')
  })

  it('should encode empty string in expected format', () => {
    const d = dumpSymbol('')
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '3a00')
  })
})
