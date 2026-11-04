'use strict'

const test = require('brittle')
const { dumpSymbolOrLink } = require('../src/dump.complex')

test('dumpSymbolOrLink tests - should return symbol when it doesn\'t exist on cache entry', (t) => {
  const symcache = ['test', 'foo']
  const d = dumpSymbolOrLink('hello', symcache)

  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '3a0a68656c6c6f')
  t.alike(symcache, ['test', 'foo', 'hello'])
})

test('dumpSymbolOrLink tests - should return symbol link when it exists on cache entry', (t) => {
  const symcache = ['test', 'foo', 'hello']
  const d = dumpSymbolOrLink('hello', symcache)

  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '3b07')
  t.alike(symcache, ['test', 'foo', 'hello'])
})

test('dumpSymbolOrLink tests - should work with large sym cache arrays', (t) => {
  const symcache = new Array(300).fill('a')
  const d1 = dumpSymbolOrLink('b', symcache)

  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '3a0662')
  t.is(symcache[300], 'b')

  const d2 = dumpSymbolOrLink('b', symcache)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '3b022c01')
})
