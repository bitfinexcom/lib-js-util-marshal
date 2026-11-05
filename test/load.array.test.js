'use strict'

const test = require('brittle')
const { loadArray } = require('../src/load.complex')

test('loadArray tests - should work with empty arrays', (t) => {
  const val = loadArray(Buffer.from('00', 'hex'), [])
  t.alike(val, [])
})

test('loadArray tests - should work with simple arrays', (t) => {
  const val = loadArray(Buffer.from('0a6908690a690c69017d69febcfe', 'hex'), [])
  t.alike(val, [3, 5, 7, 125, -324])
})

test('loadArray tests - should work with mixed arrays', (t) => {
  const val = loadArray(Buffer.from('0e6908690a690c220831323569febcfe543a097465737430220974657374', 'hex'), [])
  t.alike(val, [3, 5, 7, '125', -324, true, 'test', null, 'test'])
})

test('loadArray tests - should resolve cache symbol links', (t) => {
  const expected = [3, -324, true, 'test', null, 'test', false, 'hello', 'hello']
  const symcache = []
  const val = loadArray(Buffer.from('0e690869febcfe543a0974657374303b00463a0a68656c6c6f3b06', 'hex'), symcache)
  t.alike(val, expected)
  t.alike(symcache, ['test', 'hello'])
})

test('loadArray tests - should work with nested arrays', (t) => {
  const expected = [
    3, -324, true, 'test', null, 'test', 'hello',
    ['hello', 1, [3, 5], 'test'],
    true
  ]
  const symcache = []
  const val = loadArray(
    Buffer.from('0e690869febcfe543a0974657374303b003a0a68656c6c6f5b093b0669065b076908690a3b0054', 'hex'),
    symcache
  )
  t.alike(val, expected)
  t.alike(symcache, ['test', 'hello'])
})

test('loadArray tests - should work with complex structures', (t) => {
  const expected = [
    'hello', 12, [3, 'hello', 'test'],
    { test: true, some: { hello: null, n: 3 }, m: { v: false } }, [1], { a: 'b' }
  ]

  const buffer = Buffer.from('0b3a0a68656c6c6f69115b0869083b003a09746573747b083b0654' +
    '3a09736f6d657b073b00303a066e69083a066d7b063a0676465b0669067b063a0661220662', 'hex')
  const symcache = []
  const val = loadArray(buffer, symcache)
  t.alike(val, expected)
  t.alike(symcache, ['hello', 'test', 'some', 'n', 'm', 'v', 'a'])
})

test('loadArray tests - should return expected length from empty arrays', (t) => {
  const { len } = loadArray(Buffer.from('00', 'hex'), [], true)
  t.is(len, 1)
})

test('loadArray tests - should return expected length from simple arrays', (t) => {
  const { len } = loadArray(Buffer.from('0a6908690a690c69017d69febcfe', 'hex'), [], true)
  t.is(len, 14)
})

test('loadArray tests - should return expected length from mixed arrays', (t) => {
  const { len } = loadArray(
    Buffer.from('0e6908690a690c220831323569febcfe543a097465737430220974657374', 'hex'), [], true
  )
  t.is(len, 30)
})

test('loadArray tests - should return expected length when array contains symbol links', (t) => {
  const { len } = loadArray(Buffer.from('0e690869febcfe543a0974657374303b00463a0a68656c6c6f3b06', 'hex'), [], true)
  t.alike(len, 27)
})

test('loadArray tests - should return expected length from nested arrays', (t) => {
  const { len } = loadArray(
    Buffer.from('0e690869febcfe543a0974657374303b003a0a68656c6c6f5b093b0669065b076908690a3b0054', 'hex'), [], true
  )
  t.alike(len, 39)
})

test('loadArray tests - should return expected length from complex structures', (t) => {
  const buffer = Buffer.from('0b3a0a68656c6c6f69115b0869083b003a09746573747b083b0654' +
    '3a09736f6d657b073b00303a066e69083a066d7b063a0676465b0669067b063a0661220662', 'hex')
  const { len } = loadArray(buffer, [], true)
  t.alike(len, 64)
})
