'use strict'

const test = require('brittle')
const loadFloat = require('../src/load.float')

test('loadFloat tests - should encode positive float in expected format', (t) => {
  const val = loadFloat(Buffer.from('0c31322e33343536', 'hex'))
  t.is(val, 12.3456)
})

test('loadFloat tests - should encode negative float in expected format', (t) => {
  const val = loadFloat(Buffer.from('0d2d31322e33343536', 'hex'))
  t.is(val, -12.3456)
})

test('loadFloat tests - should encode positive infinity in expected format', (t) => {
  const val = loadFloat(Buffer.from('08696e66', 'hex'))
  t.is(val, Infinity)
})

test('loadFloat tests - should encode negative infinity in expected format', (t) => {
  const val = loadFloat(Buffer.from('092d696e66', 'hex'))
  t.is(val, -Infinity)
})

test('loadFloat tests - should encode NaN in expected format', (t) => {
  const val = loadFloat(Buffer.from('086e616e', 'hex'))
  t.ok(Number.isNaN(val))
})

test('loadFloat tests - should return accurate length for positive float', (t) => {
  const { len } = loadFloat(Buffer.from('0c31322e33343536', 'hex'), true)
  t.is(len, 8)
})

test('loadFloat tests - should return accurate length for negative float', (t) => {
  const { len } = loadFloat(Buffer.from('0d2d31322e33343536', 'hex'), true)
  t.is(len, 9)
})

test('loadFloat tests - should return accurate length for positive infinity', (t) => {
  const { len } = loadFloat(Buffer.from('08696e66', 'hex'), true)
  t.is(len, 4)
})

test('loadFloat tests - should return accurate length for negative infinity', (t) => {
  const { len } = loadFloat(Buffer.from('092d696e66', 'hex'), true)
  t.is(len, 5)
})

test('loadFloat tests - should return accurate length for NaN', (t) => {
  const { len } = loadFloat(Buffer.from('086e616e', 'hex'), true)
  t.is(len, 4)
})
