'use strict'

const test = require('brittle')
const dumpSymbolLink = require('../src/dump.symbol.link')

test('dumpSymbolLink tests - should encode symbol cache position in expected format', (t) => {
  const d = dumpSymbolLink(3)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '3b08')
})

test('dumpSymbolLink tests - should work also with large indexes', (t) => {
  const d = dumpSymbolLink(32324)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '3b02447e')
})
