'use strict'

const test = require('brittle')
const loadString = require('../src/load.string')
const { STR_ENCODINGS } = require('../src/constants')

test('loadString tests - should decode strings', (t) => {
  const val = loadString(Buffer.from('0a68656c6c6f', 'hex'))
  t.is(val, 'hello')
})

test('loadString tests - should decode large strings', (t) => {
  const val = loadString(Buffer.from('022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162', 'hex'))
  t.is(val, 'baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab')
})

test('loadString tests - should decode empty strings', (t) => {
  const val = loadString(Buffer.from('00', 'hex'))
  t.is(val, '')
})

test('loadString tests - should support different encodings', (t) => {
  const utf8 = loadString(Buffer.from('0a68656c6c6f', 'hex'), false, STR_ENCODINGS['UTF-8'])
  const usascii = loadString(Buffer.from('0a68656c6c6f', 'hex'), false, STR_ENCODINGS['US-ASCII'])
  const utf16le = loadString(Buffer.from('0f680065006c006c006f00', 'hex'), false, STR_ENCODINGS['UTF-16LE'])
  const iso88591 = loadString(Buffer.from('0a68656c6c6f', 'hex'), false, STR_ENCODINGS['ISO-8859-1'])

  t.is(utf8, 'hello')
  t.is(usascii, 'hello')
  t.is(utf16le, 'hello')
  t.is(iso88591, 'hello')
})

test('loadString tests - should return expected length for strings', (t) => {
  const { len } = loadString(Buffer.from('0a68656c6c6f', 'hex'), true)
  t.is(len, 6)
})

test('loadString tests - should return expected length for large strings', (t) => {
  const { len } = loadString(Buffer.from('022e016261616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616162', 'hex'), true)
  t.is(len, 305)
})

test('loadString tests - should return expected length for empty string', (t) => {
  const { len } = loadString(Buffer.from('00', 'hex'), true)
  t.is(len, 1)
})

test('loadString tests - should return expected length for different string encodings', (t) => {
  const { len: utf8 } = loadString(Buffer.from('0a68656c6c6f', 'hex'), true, STR_ENCODINGS['UTF-8'])
  const { len: usascii } = loadString(Buffer.from('0a68656c6c6f', 'hex'), true, STR_ENCODINGS['US-ASCII'])
  const { len: utf16le } = loadString(Buffer.from('0f680065006c006c006f00', 'hex'), true, STR_ENCODINGS['UTF-16LE'])
  const { len: iso88591 } = loadString(Buffer.from('0a68656c6c6f', 'hex'), true, STR_ENCODINGS['ISO-8859-1'])

  t.is(utf8, 6)
  t.is(usascii, 6)
  t.is(utf16le, 11)
  t.is(iso88591, 6)
})
