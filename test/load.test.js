'use strict'

const test = require('brittle')
const load = require('../src/load')

test('load tests - should decode strings correctly', (t) => {
  const val = load(Buffer.from('0408220974657374', 'hex'))
  t.is(val, 'test')
})

test('load tests - should decode booleans correctly', (t) => {
  const val1 = load(Buffer.from('040854', 'hex'))
  t.is(val1, true)

  const val2 = load(Buffer.from('040846', 'hex'))
  t.is(val2, false)
})

test('load tests - should decode nils correctly', (t) => {
  const val = load(Buffer.from('040830', 'hex'))
  t.is(val, null)
})

test('load tests - should decode numbers correctly', (t) => {
  const val1 = load(Buffer.from('04086902d204', 'hex'))
  t.is(val1, 1234)

  const val2 = load(Buffer.from('040869fe2efb', 'hex'))
  t.is(val2, -1234)

  const val3 = load(Buffer.from('04086609332e3134', 'hex'))
  t.is(val3, 3.14)

  const val4 = load(Buffer.from('0408660a2d332e3134', 'hex'))
  t.is(val4, -3.14)
})

test('load tests - should decode symbols correctly', (t) => {
  const val = load(Buffer.from('04083a0974657374', 'hex'))
  t.is(val, 'test')
})

test('load tests - should decode ivars correctly', (t) => {
  const val = load(Buffer.from('040849220a68656c6c6f073a0645543a0a407465737430', 'hex'))
  t.is(val, 'hello')
})

test('load tests - should decode objects correctly', (t) => {
  const val = load(Buffer.from('04087b063a097465737469017b', 'hex'))
  t.alike(val, { test: 123 })
})

test('load tests - should decode arrays correctly', (t) => {
  const val = load(Buffer.from('04085b0a6908690a690c69017d69febcfe', 'hex'))
  t.alike(val, [3, 5, 7, 125, -324])
})

test('load tests - should call itself properly on complex types', (t) => {
  const buffer = Buffer.from('04085b0b3a0a68656c6c6f69115b0869083b003a09746573747b083b06' +
    '54492209736f6d65063a0645547b073b00303a066e69083a066d7b063a' +
    '0676465b0669067b063a066149220662063b0754', 'hex')
  const val = load(buffer)
  t.alike(val, [
    'hello',
    12,
    [3, 'hello', 'test'],
    { test: true, some: { hello: null, n: 3 }, m: { v: false } },
    [1],
    { a: 'b' }
  ])
})

test('load tests - should throw on unsupported type', (t) => {
  t.exception(
    () => load(Buffer.from('04086d0f456e756d657261626c65', 'hex')),
    /ERR_MARSHAL_TYPE_NOT_SUPPORTED: 109/ // 6d = 'm' -> module
  )
})

test('load tests - should throw on unsupported version', (t) => {
  t.exception(
    () => load(Buffer.from('040749220a68656c6c6f063a064554', 'hex')),
    /ERR_MARSHAL_VERSION_NOT_SUPPORTED/ // 6d = 'm' -> module
  )
})
