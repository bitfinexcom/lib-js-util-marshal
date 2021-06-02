/* eslint-env mocha */

'use strict'

const assert = require('assert')
const dumpString = require('../src/dump.string')

describe('dumpString tests', () => {
  it('should encode string in expected format', () => {
    const d = dumpString('hello')
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '220a68656c6c6f')
  })

  it('should encode large string in expected format', () => {
    const d = dumpString('baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab')
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '22022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162')
  })

  it('should encode empty string in expected format', () => {
    const d = dumpString('')
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '2200')
  })
})
