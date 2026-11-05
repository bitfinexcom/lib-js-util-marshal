'use strict'

const test = require('brittle')
const { decodeType } = require('../src/load.complex')

test('decodeType tests - should decode strings correctly', (t) => {
  const val = decodeType(Buffer.from('220974657374', 'hex'), [])
  t.is(val, 'test')
})

test('decodeType tests - should decode booleans correctly', (t) => {
  const val1 = decodeType(Buffer.from('54', 'hex'), [])
  t.is(val1, true)

  const val2 = decodeType(Buffer.from('46', 'hex'), [])
  t.is(val2, false)
})

test('decodeType tests - should decode nils correctly', (t) => {
  const val = decodeType(Buffer.from('30', 'hex'), [])
  t.is(val, null)
})

test('decodeType tests - should decode numbers correctly', (t) => {
  const val1 = decodeType(Buffer.from('6902d204', 'hex'), [])
  t.is(val1, 1234)

  const val2 = decodeType(Buffer.from('69fe2efb', 'hex'), [])
  t.is(val2, -1234)

  const val3 = decodeType(Buffer.from('6609332e3134', 'hex'), [])
  t.is(val3, 3.14)

  const val4 = decodeType(Buffer.from('660a2d332e3134', 'hex'), [])
  t.is(val4, -3.14)
})

test('decodeType tests - should decode symbols correctly', (t) => {
  const symcache = []

  const val1 = decodeType(Buffer.from('3a0974657374', 'hex'), symcache)
  t.is(val1, 'test')
  t.alike(symcache, ['test'])

  const val2 = decodeType(Buffer.from('3a0974657374', 'hex'), symcache)
  t.is(val2, 'test')
  t.alike(symcache, ['test'])
})

test('decodeType tests - should decode symbol links correctly', (t) => {
  const symcache = ['test', 'foo', 'bar', 'beta']
  const val = decodeType(Buffer.from('3b08', 'hex'), symcache)
  t.is(val, 'beta')
})

test('decodeType tests - should decode ivars correctly', (t) => {
  const symcache = []
  const val = decodeType(Buffer.from('49220a68656c6c6f073a0645543a0a407465737430', 'hex'), symcache)
  t.is(val, 'hello')
  t.alike(symcache, ['E', '@test'])
})

test('decodeType tests - should decode objects correctly', (t) => {
  const symcache = []
  const val = decodeType(Buffer.from('7b063a097465737469017b', 'hex'), symcache)
  t.alike(val, { test: 123 })
  t.alike(symcache, ['test'])
})

test('decodeType tests - should decode arrays correctly', (t) => {
  const val = decodeType(Buffer.from('5b0a6908690a690c69017d69febcfe', 'hex'), [])
  t.alike(val, [3, 5, 7, 125, -324])
})

test('decodeType tests - should call itself properly on complex types', (t) => {
  const buffer = Buffer.from('5b0b3a0a68656c6c6f69115b0869083b003a09746573747b083b06' +
    '54492209736f6d65063a0645547b073b00303a066e69083a066d7b063a' +
    '0676465b0669067b063a066149220662063b0754', 'hex')
  const symcache = []
  const val = decodeType(buffer, symcache)
  t.alike(val, [
    'hello',
    12,
    [3, 'hello', 'test'],
    { test: true, some: { hello: null, n: 3 }, m: { v: false } },
    [1],
    { a: 'b' }
  ])
  t.alike(symcache, ['hello', 'test', 'E', 'n', 'm', 'v', 'a'])
})

test('decodeType tests - should throw on unsupported type', (t) => {
  t.exception(
    () => decodeType(Buffer.from('6d0f456e756d657261626c65', 'hex'), []),
    /ERR_MARSHAL_TYPE_NOT_SUPPORTED: 109/ // 6d = 'm' -> module
  )
})

test('decodeType tests - should decode byte lengths of strings correctly', (t) => {
  const { len } = decodeType(Buffer.from('220974657374', 'hex'), [], true)
  t.is(len, 5)
})

test('decodeType tests - should decode byte lengths of booleans correctly', (t) => {
  const { len: len1 } = decodeType(Buffer.from('54', 'hex'), [], true)
  t.is(len1, 0)

  const { len: len2 } = decodeType(Buffer.from('46', 'hex'), [], true)
  t.is(len2, 0)
})

test('decodeType tests - should decode byte lengths of nils correctly', (t) => {
  const { len } = decodeType(Buffer.from('30', 'hex'), [], true)
  t.is(len, 0)
})

test('decodeType tests - should decode byte lengths of numbers correctly', (t) => {
  const { len: len1 } = decodeType(Buffer.from('6902d204', 'hex'), [], true)
  t.is(len1, 3)

  const { len: len2 } = decodeType(Buffer.from('69fe2efb', 'hex'), [], true)
  t.is(len2, 3)

  const { len: len3 } = decodeType(Buffer.from('6609332e3134', 'hex'), [], true)
  t.is(len3, 5)

  const { len: len4 } = decodeType(Buffer.from('660a2d332e3134', 'hex'), [], true)
  t.is(len4, 6)
})

test('decodeType tests - should decode byte lengths of symbols correctly', (t) => {
  const { len } = decodeType(Buffer.from('3a0974657374', 'hex'), [], true)
  t.is(len, 5)
})

test('decodeType tests - should decode byte lengths of symbol links correctly', (t) => {
  const { len } = decodeType(Buffer.from('3b08', 'hex'), [], true)
  t.is(len, 1)
})

test('decodeType tests - should decode byte lengths of ivars correctly', (t) => {
  const { len } = decodeType(Buffer.from('49220a68656c6c6f073a0645543a0a407465737430', 'hex'), [], true)
  t.is(len, 20)
})

test('decodeType tests - should decode byte lengths of objects correctly', (t) => {
  const { len } = decodeType(Buffer.from('7b063a097465737469017b', 'hex'), [], true)
  t.alike(len, 10)
})

test('decodeType tests - should decode byte lengths of arrays correctly', (t) => {
  const { len } = decodeType(Buffer.from('5b0a6908690a690c69017d69febcfe', 'hex'), [], true)
  t.alike(len, 14)
})

test('decodeType tests - should decode byte lengths of complex types correctly', (t) => {
  const buffer = Buffer.from('5b0b3a0a68656c6c6f69115b0869083b003a09746573747b083b06' +
    '54492209736f6d65063a0645547b073b00303a066e69083a066d7b063a' +
    '0676465b0669067b063a066149220662063b0754', 'hex')
  const { len } = decodeType(buffer, [], true)
  t.alike(len, 75)
})
