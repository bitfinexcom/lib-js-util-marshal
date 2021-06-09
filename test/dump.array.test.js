/* eslint-env mocha */

'use strict'

const assert = require('assert')
const { dumpArray } = require('../src/dump.complex')

describe('dumpArray tests', () => {
  it('should work with empty arrays', () => {
    const d = dumpArray([], [])
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '5b00')
  })

  it('should work with simple arrays', () => {
    const d = dumpArray([3, 5, 7, 125, -324], [])
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '5b0a6908690a690c69017d69febcfe')
  })

  it('should work with mixed arrays', () => {
    const d = dumpArray([3, 5, 7, '125', -324, true, Symbol('test'), null, 'test'], [])
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '5b0e6908690a690c220831323569febcfe543a097465737430220974657374')
  })

  it('should cache symbols as symbol links', () => {
    const symcache = []
    const d = dumpArray(
      [3, -324, true, Symbol('test'), null, Symbol('test'), false, Symbol('hello'), Symbol('hello')],
      symcache
    )
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '5b0e690869febcfe543a0974657374303b00463a0a68656c6c6f3b06')
    assert.deepStrictEqual(symcache, ['test', 'hello'])
  })

  it('should work with nested arrays', () => {
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
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), expected)
    assert.deepStrictEqual(symcache, ['test', 'hello'])
  })

  it('should work with complex structures', () => {
    const expected = '5b0b3a0a68656c6c6f69115b0869083b003a09746573747b083b0654' +
      '3a09736f6d657b073b00303a066e69083a066d7b063a0676465b0669067b063a0661220662'
    const symcache = []
    const d = dumpArray(
      [Symbol('hello'), 12, [3, Symbol('hello'), Symbol('test')], { test: true, some: { hello: null, n: 3 }, m: { v: false } }, [1], { a: 'b' }],
      symcache
    )
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), expected)
    assert.deepStrictEqual(symcache, ['hello', 'test', 'some', 'n', 'm', 'v', 'a'])
  })
})
