'use strict'

const test = require('brittle')
const { loadHash } = require('../src/load.complex')

test('loadHash tests - should work with empty objects', (t) => {
  const val = loadHash(Buffer.from('00', 'hex'), [])
  t.alike(val, {})
})

test('loadHash tests - should work with simple objects', (t) => {
  const val = loadHash(Buffer.from('063a08666f6f2208626172', 'hex'), [])
  t.alike(val, { foo: 'bar' })
})

test('loadHash tests - should work with mixed objects', (t) => {
  const buffer = Buffer.from('083a08666f6f22086261723a0974657374543a0a6974656d735b08690669f830', 'hex')
  const val = loadHash(buffer, [])
  t.alike(val, { foo: 'bar', test: true, items: [1, -3, null] })
})

test('loadHash tests - should resolve cache symbol links', (t) => {
  const buffer = Buffer.from('083a0974657374463a09686173683b003a0a76616c756569fe00fc', 'hex')
  const symcache = []
  const val = loadHash(buffer, symcache)
  t.alike(val, { test: false, hash: 'test', value: -1024 })
  t.alike(symcache, ['test', 'hash', 'value'])
})

test('loadHash tests - should work with nested objects', (t) => {
  const buffer = Buffer.from('093a096e616d65220a766967616e3a08616765691f3a09636379735b' +
    '07220862746322086574683a0a62646174657b083a09796561726902c6' +
    '073a0a6d6f6e746869063a086461796906', 'hex')
  const symcache = []
  const val = loadHash(buffer, symcache)
  t.alike(val, {
    name: 'vigan',
    age: 26,
    ccys: ['btc', 'eth'],
    bdate: { year: 1990, month: 1, day: 1 }
  })
  t.alike(symcache, ['name', 'age', 'ccys', 'bdate', 'year', 'month', 'day'])
})

test('loadHash tests - should work with complex structures', (t) => {
  const buffer = Buffer.from('0b3a063169073a0d746573742d76616c691c3a08666f6f7b063a0862' +
    '6172303a0a76616c75655b086906690769083a096d61736b7b093a0968' +
    '617368220c74657374696e673a0873796d3a06743a0876617222003a07' +
    '74737b083a09646174656902c9073a0a6d6f6e746822084a616e3a0a6d' +
    '6963726f5b086906690769003a096d61726b3b07', 'hex')
  const expectedSymCache = [
    '1', 'test-val', 'foo', 'bar', 'value', 'mask', 'hash', 'sym', 't', 'var',
    'ts', 'date', 'month', 'micro', 'mark'
  ]
  const symcache = []
  const val = loadHash(buffer, symcache)
  t.alike(val, {
    'test-val': 23,
    foo: { bar: null },
    1: 2,
    value: [1, 2, 3],
    mask: { hash: 'testing', sym: 't', var: '', ts: { date: 1993, month: 'Jan', micro: [1, 2, 0] } },
    mark: 'foo'
  })
  t.alike(symcache, expectedSymCache)
})

test('loadHash tests - should return expected length from empty objects', (t) => {
  const { len } = loadHash(Buffer.from('00', 'hex'), [], true)
  t.is(len, 1)
})

test('loadHash tests - should return expected length from simple objects', (t) => {
  const { len } = loadHash(Buffer.from('063a08666f6f2208626172', 'hex'), [], true)
  t.is(len, 11)
})

test('loadHash tests - should return expected length from mixed objects', (t) => {
  const buffer = Buffer.from('083a08666f6f22086261723a0974657374543a0a6974656d735b08690669f830', 'hex')
  const { len } = loadHash(buffer, [], true)
  t.is(len, 32)
})

test('loadHash tests - should return expected length when array contains symbol links', (t) => {
  const buffer = Buffer.from('083a0974657374463a09686173683b003a0a76616c756569fe00fc', 'hex')
  const { len } = loadHash(buffer, [], true)
  t.is(len, 27)
})

test('loadHash tests - should return expected length from nested objects', (t) => {
  const buffer = Buffer.from('093a096e616d65220a766967616e3a08616765691f3a09636379735b' +
    '07220862746322086574683a0a62646174657b083a09796561726902c6' +
    '073a0a6d6f6e746869063a086461796906', 'hex')
  const { len } = loadHash(buffer, [], true)
  t.is(len, 74)
})

test('loadHash tests - should return expected length from complex structures', (t) => {
  const buffer = Buffer.from('0b3a063169073a0d746573742d76616c691c3a08666f6f7b063a0862' +
    '6172303a0a76616c75655b086906690769083a096d61736b7b093a0968' +
    '617368220c74657374696e673a0873796d3a06743a0876617222003a07' +
    '74737b083a09646174656902c9073a0a6d6f6e746822084a616e3a0a6d' +
    '6963726f5b086906690769003a096d61726b3b07', 'hex')
  const { len } = loadHash(buffer, [], true)
  t.is(len, 135)
})
