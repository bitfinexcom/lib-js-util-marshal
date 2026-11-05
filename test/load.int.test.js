'use strict'

const test = require('brittle')
const loadInt = require('../src/load.int')

test('loadInt tests - should return expected format for zero', (t) => {
  const val = loadInt(Buffer.from('00', 'hex'))
  t.is(val, 0)
})

test('loadInt tests - should return expected format for short positive ints', (t) => {
  const val1 = loadInt(Buffer.from('06', 'hex'))
  t.is(val1, 1)

  const val2 = loadInt(Buffer.from('07', 'hex'))
  t.is(val2, 2)

  const val3 = loadInt(Buffer.from('7f', 'hex'))
  t.is(val3, 122)
})

test('loadInt tests - should return expected format for short negative ints', (t) => {
  const val1 = loadInt(Buffer.from('fa', 'hex'))
  t.is(val1, -1)

  const val2 = loadInt(Buffer.from('f9', 'hex'))
  t.is(val2, -2)

  const val3 = loadInt(Buffer.from('80', 'hex'))
  t.is(val3, -123)
})

test('loadInt tests - should return expected format for 2 byte positive ints', (t) => {
  const val1 = loadInt(Buffer.from('017b', 'hex'))
  t.is(val1, 123)

  const val2 = loadInt(Buffer.from('01ff', 'hex'))
  t.is(val2, 255)
})

test('loadInt tests - should return expected format for 2 byte negative ints', (t) => {
  const val1 = loadInt(Buffer.from('ff84', 'hex'))
  t.is(val1, -124)

  const val2 = loadInt(Buffer.from('ff00', 'hex'))
  t.is(val2, -256)
})

test('loadInt tests - should return expected format for 3 byte positive ints', (t) => {
  const val1 = loadInt(Buffer.from('020001', 'hex'))
  t.is(val1, 256)

  const val2 = loadInt(Buffer.from('02ffff', 'hex'))
  t.is(val2, 65535)
})

test('loadInt tests - should return expected format for 3 byte negative ints', (t) => {
  const val1 = loadInt(Buffer.from('fefffe', 'hex'))
  t.is(val1, -257)

  const val2 = loadInt(Buffer.from('fe0000', 'hex'))
  t.is(val2, -65536)
})

test('loadInt tests - should return expected format for 4 byte positive ints', (t) => {
  const val1 = loadInt(Buffer.from('03000001', 'hex'))
  t.is(val1, 65536)

  const val2 = loadInt(Buffer.from('03ffffff', 'hex'))
  t.is(val2, 16777215)
})

test('loadInt tests - should return expected format for 4 byte negative ints', (t) => {
  const val1 = loadInt(Buffer.from('fdfffffe', 'hex'))
  t.is(val1, -65537)

  const val2 = loadInt(Buffer.from('fd000000', 'hex'))
  t.is(val2, -16777216)
})

test('loadInt tests - should return expected format for 5 byte positive ints', (t) => {
  const val1 = loadInt(Buffer.from('0400000001', 'hex'))
  t.is(val1, 16777216)

  const val2 = loadInt(Buffer.from('04ffffff3f', 'hex'))
  t.is(val2, 2 ** 30 - 1)
})

test('loadInt tests - should return expected format for 5 byte positive ints', (t) => {
  const val1 = loadInt(Buffer.from('fcfffffffe', 'hex'))
  t.is(val1, -16777217)

  const val2 = loadInt(Buffer.from('fc000000c0', 'hex'))
  t.is(val2, -(2 ** 30))
})

test('loadInt tests - should return expected length for zero', (t) => {
  const { len } = loadInt(Buffer.from('00', 'hex'), true)
  t.is(len, 1)
})

test('loadInt tests - should return expected length for short positive ints', (t) => {
  const { len: len1 } = loadInt(Buffer.from('06', 'hex'), true)
  t.is(len1, 1)

  const { len: len2 } = loadInt(Buffer.from('7f', 'hex'), true)
  t.is(len2, 1)
})

test('loadInt tests - should return expected length for short negative ints', (t) => {
  const { len: len1 } = loadInt(Buffer.from('fa', 'hex'), true)
  t.is(len1, 1)

  const { len: len2 } = loadInt(Buffer.from('80', 'hex'), true)
  t.is(len2, 1)
})

test('loadInt tests - should return expected length for 2 byte positive ints', (t) => {
  const { len: len1 } = loadInt(Buffer.from('017b', 'hex'), true)
  t.is(len1, 2)

  const { len: len2 } = loadInt(Buffer.from('01ff', 'hex'), true)
  t.is(len2, 2)
})

test('loadInt tests - should return expected length for 2 byte negative ints', (t) => {
  const { len: len1 } = loadInt(Buffer.from('ff84', 'hex'), true)
  t.is(len1, 2)

  const { len: len2 } = loadInt(Buffer.from('ff00', 'hex'), true)
  t.is(len2, 2)
})

test('loadInt tests - should return expected length for 3 byte positive ints', (t) => {
  const { len: len1 } = loadInt(Buffer.from('020001', 'hex'), true)
  t.is(len1, 3)

  const { len: len2 } = loadInt(Buffer.from('02ffff', 'hex'), true)
  t.is(len2, 3)
})

test('loadInt tests - should return expected length for 3 byte negative ints', (t) => {
  const { len: len1 } = loadInt(Buffer.from('fefffe', 'hex'), true)
  t.is(len1, 3)

  const { len: len2 } = loadInt(Buffer.from('fe0000', 'hex'), true)
  t.is(len2, 3)
})

test('loadInt tests - should return expected length for 4 byte positive ints', (t) => {
  const { len: len1 } = loadInt(Buffer.from('03000001', 'hex'), true)
  t.is(len1, 4)

  const { len: len2 } = loadInt(Buffer.from('03ffffff', 'hex'), true)
  t.is(len2, 4)
})

test('loadInt tests - should return expected length for 4 byte negative ints', (t) => {
  const { len: len1 } = loadInt(Buffer.from('fdfffffe', 'hex'), true)
  t.is(len1, 4)

  const { len: len2 } = loadInt(Buffer.from('fd000000', 'hex'), true)
  t.is(len2, 4)
})

test('loadInt tests - should return expected length for 5 byte positive ints', (t) => {
  const { len: len1 } = loadInt(Buffer.from('0400000001', 'hex'), true)
  t.is(len1, 5)

  const { len: len2 } = loadInt(Buffer.from('04ffffff3f', 'hex'), true)
  t.is(len2, 5)
})

test('loadInt tests - should return expected length for 5 byte positive ints', (t) => {
  const { len: len1 } = loadInt(Buffer.from('fcfffffffe', 'hex'), true)
  t.is(len1, 5)

  const { len: len2 } = loadInt(Buffer.from('fc000000c0', 'hex'), true)
  t.is(len2, 5)
})
