/* eslint-env mocha */

'use strict'

const assert = require('assert')
const dumpSymbolLink = require('../src/dump.symbol.link')

describe('dumpSymbolLink tests', () => {
  it('should encode symbol cache position in expected format', () => {
    const d = dumpSymbolLink(3)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '3b08')
  })

  it('should work also with large indexes', () => {
    const d = dumpSymbolLink(32324)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '3b02447e')
  })
})
