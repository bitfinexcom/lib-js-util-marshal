'use strict'

const test = require('brittle')
const dump = require('../src/dump')

test('dump tests - should encode strings correctly', (t) => {
  const d = dump('test')
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '0408220974657374')
})

test('dump tests - should encode booleans correctly', (t) => {
  const d1 = dump(true)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '040854')

  const d2 = dump(false)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '040846')
})

test('dump tests - should encode nils correctly', (t) => {
  const d = dump(null)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '040830')
})

test('dump tests - should encode numbers correctly', (t) => {
  const d1 = dump(1234)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '04086902d204')

  const d2 = dump(-1234)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '040869fe2efb')

  const d3 = dump(3.14)
  t.is(d3 instanceof Buffer, true)
  t.is(d3.toString('hex'), '04086609332e3134')

  const d4 = dump(-3.14)
  t.is(d4 instanceof Buffer, true)
  t.is(d4.toString('hex'), '0408660a2d332e3134')
})

test('dump tests - should encode symbols correctly', (t) => {
  const d1 = dump(Symbol('test'))
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '04083a0974657374')
})

test('dump tests - should encode objects correctly', (t) => {
  const d = dump({ test: 123 })
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '04087b063a097465737469017b')
})

test('dump tests - should encode arrays correctly', (t) => {
  const d = dump([3, 5, 7, 125, -324])
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '04085b0a6908690a690c69017d69febcfe')
})

test('dump tests - should work properly on complex types', (t) => {
  const expected = '04087b083a0631543a08666f6f22086261723a09646174615b0a2206613046' +
    '660a2d332e31345b08690669077b063a096e616d6522086a6f65'
  const d = dump({
    foo: 'bar',
    1: true,
    data: [
      'a', null, false, -3.14,
      [1, 2, { name: 'joe' }]
    ]
  })
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), expected)
})
