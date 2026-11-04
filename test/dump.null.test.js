'use strict'

const test = require('brittle')
const dumpNull = require('../src/dump.null')

test('dumpNull tests - should return expected format', (t) => {
  const d = dumpNull()
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '30')
})
