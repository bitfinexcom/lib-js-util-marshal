'use strict'

const test = require('brittle')
const loadSymbolLink = require('../src/load.symbol.link')

test('loadSymbolLink tests - should decode symbol value from expected position', (t) => {
  const symcache = ['test', 'foo', 'bar', 'beta']
  const val = loadSymbolLink(Buffer.from('08', 'hex'), symcache)
  t.is(val, 'beta')
})

test('loadSymbolLink tests - should work also with large indexes', (t) => {
  const symcache = new Array(32324).fill('a')
  symcache.push('alpha')
  const val = loadSymbolLink(Buffer.from('02447e', 'hex'), symcache)
  t.is(val, 'alpha')
})

test('loadSymbolLink tests - should return expected length for small int positions', (t) => {
  const symcache = ['test', 'foo', 'bar', 'beta']
  const { len } = loadSymbolLink(Buffer.from('08', 'hex'), symcache, true)
  t.is(len, 1)
})

test('loadSymbolLink tests - should return expected length for large int positions', (t) => {
  const symcache = new Array(32324).fill('a')
  symcache.push('alpha')
  const { len } = loadSymbolLink(Buffer.from('02447e', 'hex'), symcache, true)
  t.is(len, 3)
})
