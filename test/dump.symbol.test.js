'use strict'

const test = require('brittle')
const dumpSymbol = require('../src/dump.symbol')

test('dumpSymbol tests - should encode string in expected format', (t) => {
  const d = dumpSymbol('hello')
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '3a0a68656c6c6f')
})

test('dumpSymbol tests - should encode large string in expected format', (t) => {
  const d = dumpSymbol('baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab')
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '3a022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162')
})

test('dumpSymbol tests - should encode empty string in expected format', (t) => {
  const d = dumpSymbol('')
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '3a00')
})
