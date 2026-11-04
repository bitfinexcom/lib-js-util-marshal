'use strict'

const test = require('brittle')
const { dumpArray } = require('../src/dump.complex')

test('dumpArray tests - should work with empty arrays', (t) => {
  const d = dumpArray([], [])
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '5b00')
})

test('dumpArray tests - should work with simple arrays', (t) => {
  const d = dumpArray([3, 5, 7, 125, -324], [])
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '5b0a6908690a690c69017d69febcfe')
})

test('dumpArray tests - should work with mixed arrays', (t) => {
  const d = dumpArray([3, 5, 7, '125', -324, true, Symbol('test'), null, 'test'], [])
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '5b0e6908690a690c220831323569febcfe543a097465737430220974657374')
})

test('dumpArray tests - should cache symbols as symbol links', (t) => {
  const symcache = []
  const d = dumpArray(
    [3, -324, true, Symbol('test'), null, Symbol('test'), false, Symbol('hello'), Symbol('hello')],
    symcache
  )
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '5b0e690869febcfe543a0974657374303b00463a0a68656c6c6f3b06')
  t.alike(symcache, ['test', 'hello'])
})

test('dumpArray tests - should work with nested arrays', (t) => {
  const expected = '5b0e690869febcfe543a0974657374303b003a0a68656c6c6f5b093b0669065b076908690a3b0054'
  const symcache = []
  const d = dumpArray(
    [
      3, -324, true, Symbol('test'), null, Symbol('test'), Symbol('hello'),
      [Symbol('hello'), 1, [3, 5], Symbol('test')],
      true
    ],
    symcache
  )
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), expected)
  t.alike(symcache, ['test', 'hello'])
})

test('dumpArray tests - should work with complex structures', (t) => {
  const expected = '5b0b3a0a68656c6c6f69115b0869083b003a09746573747b083b0654' +
    '3a09736f6d657b073b00303a066e69083a066d7b063a0676465b0669067b063a0661220662'
  const symcache = []
  const d = dumpArray(
    [Symbol('hello'), 12, [3, Symbol('hello'), Symbol('test')], { test: true, some: { hello: null, n: 3 }, m: { v: false } }, [1], { a: 'b' }],
    symcache
  )
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), expected)
  t.alike(symcache, ['hello', 'test', 'some', 'n', 'm', 'v', 'a'])
})
