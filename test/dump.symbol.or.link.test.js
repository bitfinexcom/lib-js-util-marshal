/* eslint-env mocha */

'use strict'

const assert = require('assert')
const { dumpSymbolOrLink } = require('../src/dump.complex')

describe('dumpSymbolOrLink tests', () => {
  it('should return symbol when it doesn\'t exist on cache entry', () => {
    const symcache = ['test', 'foo']
    const d = dumpSymbolOrLink('hello', symcache)

    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '3a0a68656c6c6f')
    assert.deepStrictEqual(symcache, ['test', 'foo', 'hello'])
  })

  it('should return symbol link when it exists on cache entry', () => {
    const symcache = ['test', 'foo', 'hello']
    const d = dumpSymbolOrLink('hello', symcache)

    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '3b07')
    assert.deepStrictEqual(symcache, ['test', 'foo', 'hello'])
  })

  it('should work with large sym cache arrays', () => {
    const symcache = new Array(300).fill('a')
    const d1 = dumpSymbolOrLink('b', symcache)

    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '3a0662')
    assert.strictEqual(symcache[300], 'b')

    const d2 = dumpSymbolOrLink('b', symcache)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '3b022c01')
  })
})
