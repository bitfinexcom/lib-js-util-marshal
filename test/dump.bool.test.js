'use strict'

const test = require('brittle')
const dumpBool = require('../src/dump.bool')

test('dumpBool tests - should return expected format for true', (t) => {
  const d = dumpBool(true)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '54')
})

test('dumpBool tests - should return expected format for false', (t) => {
  const d = dumpBool(false)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '46')
})
