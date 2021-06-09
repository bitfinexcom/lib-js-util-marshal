/* eslint-env mocha */

'use strict'

const assert = require('assert')
const { loadArray } = require('../src/load.complex')

describe('loadArray tests', () => {
  it('should work with empty arrays', () => {
    const val = loadArray(Buffer.from('00', 'hex'), [])
    assert.deepStrictEqual(val, [])
  })

  it('should work with simple arrays', () => {
    const val = loadArray(Buffer.from('0a6908690a690c69017d69febcfe', 'hex'), [])
    assert.deepStrictEqual(val, [3, 5, 7, 125, -324])
  })

  it('should work with mixed arrays', () => {
    const val = loadArray(Buffer.from('0e6908690a690c220831323569febcfe543a097465737430220974657374', 'hex'), [])
    assert.deepStrictEqual(val, [3, 5, 7, '125', -324, true, 'test', null, 'test'])
  })

  it('should resolve cache symbol links', () => {
    const expected = [3, -324, true, 'test', null, 'test', false, 'hello', 'hello']
    const symcache = []
    const val = loadArray(Buffer.from('0e690869febcfe543a0974657374303b00463a0a68656c6c6f3b06', 'hex'), symcache)
    assert.deepStrictEqual(val, expected)
    assert.deepStrictEqual(symcache, ['test', 'hello'])
  })

  it('should work with nested arrays', () => {
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
    assert.deepStrictEqual(val, expected)
    assert.deepStrictEqual(symcache, ['test', 'hello'])
  })

  it('should work with complex structures', () => {
    const expected = [
      'hello', 12, [3, 'hello', 'test'],
      { test: true, some: { hello: null, n: 3 }, m: { v: false } }, [1], { a: 'b' }
    ]

    const buffer = Buffer.from('0b3a0a68656c6c6f69115b0869083b003a09746573747b083b0654' +
      '3a09736f6d657b073b00303a066e69083a066d7b063a0676465b0669067b063a0661220662', 'hex')
    const symcache = []
    const val = loadArray(buffer, symcache)
    assert.deepStrictEqual(val, expected)
    assert.deepStrictEqual(symcache, ['hello', 'test', 'some', 'n', 'm', 'v', 'a'])
  })

  it('should return expected length from empty arrays', () => {
    const { len } = loadArray(Buffer.from('00', 'hex'), [], true)
    assert.strictEqual(len, 1)
  })

  it('should return expected length from simple arrays', () => {
    const { len } = loadArray(Buffer.from('0a6908690a690c69017d69febcfe', 'hex'), [], true)
    assert.strictEqual(len, 14)
  })

  it('should return expected length from mixed arrays', () => {
    const { len } = loadArray(
      Buffer.from('0e6908690a690c220831323569febcfe543a097465737430220974657374', 'hex'), [], true
    )
    assert.strictEqual(len, 30)
  })

  it('should return expected length when array contains symbol links', () => {
    const { len } = loadArray(Buffer.from('0e690869febcfe543a0974657374303b00463a0a68656c6c6f3b06', 'hex'), [], true)
    assert.deepStrictEqual(len, 27)
  })

  it('should return expected length from nested arrays', () => {
    const { len } = loadArray(
      Buffer.from('0e690869febcfe543a0974657374303b003a0a68656c6c6f5b093b0669065b076908690a3b0054', 'hex'), [], true
    )
    assert.deepStrictEqual(len, 39)
  })

  it('should return expected length from complex structures', () => {
    const buffer = Buffer.from('0b3a0a68656c6c6f69115b0869083b003a09746573747b083b0654' +
      '3a09736f6d657b073b00303a066e69083a066d7b063a0676465b0669067b063a0661220662', 'hex')
    const { len } = loadArray(buffer, [], true)
    assert.deepStrictEqual(len, 64)
  })
})
