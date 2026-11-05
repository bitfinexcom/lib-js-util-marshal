'use strict'

const test = require('brittle')
const { runInNewContext } = require('vm')
const { encodeType } = require('../src/dump.complex')

test('encodeType tests - should encode strings correctly', (t) => {
  const d = encodeType('test', [])
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '220974657374')
})

test('encodeType tests - should encode booleans correctly', (t) => {
  const d1 = encodeType(true, [])
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '54')

  const d2 = encodeType(false, [])
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '46')
})

test('encodeType tests - should encode nils correctly', (t) => {
  const d = encodeType(null, [])
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '30')
})

test('encodeType tests - should encode numbers correctly', (t) => {
  const d1 = encodeType(1234, [])
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '6902d204')

  const d2 = encodeType(-1234, [])
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '69fe2efb')

  const d3 = encodeType(3.14, [])
  t.is(d3 instanceof Buffer, true)
  t.is(d3.toString('hex'), '6609332e3134')

  const d4 = encodeType(-3.14, [])
  t.is(d4 instanceof Buffer, true)
  t.is(d4.toString('hex'), '660a2d332e3134')
})

test('encodeType tests - should encode symbols correctly', (t) => {
  const symcache = []

  const d1 = encodeType(Symbol('test'), symcache)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '3a0974657374')
  t.alike(symcache, ['test'])

  const d2 = encodeType(Symbol('test'), symcache)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '3b00')
  t.alike(symcache, ['test'])
})

test('encodeType tests - should encode objects correctly', (t) => {
  const symcache = []
  const d = encodeType({ test: 123 }, symcache)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '7b063a097465737469017b')
  t.alike(symcache, ['test'])
})

test('encodeType tests - should encode arrays correctly', (t) => {
  const d = encodeType([3, 5, 7, 125, -324], [])
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '5b0a6908690a690c69017d69febcfe')
})

test('encodeType tests - should call itself properly on complex types', (t) => {
  const expected = '7b083a0631543a08666f6f22086261723a09646174615b0a2206613046' +
    '660a2d332e31345b08690669077b063a096e616d6522086a6f65'
  const symcache = []
  const d = encodeType(
    {
      foo: 'bar',
      1: true,
      data: [
        'a', null, false, -3.14,
        [1, 2, { name: 'joe' }]
      ]
    },
    symcache
  )
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), expected)
  t.alike(symcache, ['1', 'foo', 'data', 'name'])
})

test('encodeType tests - should throw on unsupported type', (t) => {
  t.exception(() => encodeType(BigInt('9007199254740991'), []), /ERR_MARSHAL_TYPE_NOT_SUPPORTED/)

  t.exception(() => encodeType(undefined, []), /ERR_MARSHAL_TYPE_NOT_SUPPORTED/)
})

test('encodeType tests - should throw on non plain objects', (t) => {
  const samples = [
    Buffer.from([1, 2, 3]),
    new Map([['foo', 'bar'], ['test', 123]])
  ]

  for (const data of samples) {
    t.exception(() => encodeType(data, []), /ERR_MARSHAL_TYPE_NOT_SUPPORTED/)
  }
})

test('encodeType tests - should encode plain objects from other realms', (t) => {
  const val = encodeType(runInNewContext('({ test: 123 })'), [])
  t.is(val.toString('hex'), '7b063a097465737469017b')
})
