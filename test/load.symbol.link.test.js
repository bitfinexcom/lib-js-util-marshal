/* eslint-env mocha */

'use strict'

const assert = require('assert')
const loadSymbolLink = require('../src/load.symbol.link')

describe('loadSymbolLink tests', () => {
  it('should decode symbol value from expected position', () => {
    const symcache = ['test', 'foo', 'bar', 'beta']
    const val = loadSymbolLink(Buffer.from('08', 'hex'), symcache)
    assert.strictEqual(val, 'beta')
  })

  it('should work also with large indexes', () => {
    const symcache = new Array(32324).fill('a')
    symcache.push('alpha')
    const val = loadSymbolLink(Buffer.from('02447e', 'hex'), symcache)
    assert.strictEqual(val, 'alpha')
  })

  it('should return expected length for small int positions', () => {
    const symcache = ['test', 'foo', 'bar', 'beta']
    const { len } = loadSymbolLink(Buffer.from('08', 'hex'), symcache, true)
    assert.strictEqual(len, 1)
  })

  it('should return expected length for large int positions', () => {
    const symcache = new Array(32324).fill('a')
    symcache.push('alpha')
    const { len } = loadSymbolLink(Buffer.from('02447e', 'hex'), symcache, true)
    assert.strictEqual(len, 3)
  })
})
