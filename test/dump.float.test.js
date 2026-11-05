'use strict'

const test = require('brittle')
const dumpFloat = require('../src/dump.float')

test('dumpFloat tests - should encode positive float in expected format', (t) => {
  const d = dumpFloat(12.3456)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '660c31322e33343536')
})

test('dumpFloat tests - should encode negative float in expected format', (t) => {
  const d = dumpFloat(-12.3456)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '660d2d31322e33343536')
})

test('dumpFloat tests - should encode positive infinity in expected format', (t) => {
  const d = dumpFloat(Infinity)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '6608696e66')
})

test('dumpFloat tests - should encode negative infinity in expected format', (t) => {
  const d = dumpFloat(-Infinity)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '66092d696e66')
})

test('dumpFloat tests - should encode NaN in expected format', (t) => {
  const d = dumpFloat(NaN)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '66086e616e')
})
