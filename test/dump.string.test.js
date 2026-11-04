'use strict'

const test = require('brittle')
const dumpString = require('../src/dump.string')

test('dumpString tests - should encode string in expected format', (t) => {
  const d = dumpString('hello')
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '220a68656c6c6f')
})

test('dumpString tests - should encode large string in expected format', (t) => {
  const d = dumpString('baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab')
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '22022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162')
})

test('dumpString tests - should encode empty string in expected format', (t) => {
  const d = dumpString('')
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '2200')
})
