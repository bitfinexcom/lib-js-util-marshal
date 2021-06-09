/* eslint-env mocha */

'use strict'

const assert = require('assert')
const { decodeType } = require('../src/load.complex')

describe('decodeType tests', () => {
  it('should decode strings correctly', () => {
    const val = decodeType(Buffer.from('220974657374', 'hex'), [])
    assert.strictEqual(val, 'test')
  })

  it('should decode booleans correctly', () => {
    const val1 = decodeType(Buffer.from('54', 'hex'), [])
    assert.strictEqual(val1, true)

    const val2 = decodeType(Buffer.from('46', 'hex'), [])
    assert.strictEqual(val2, false)
  })

  it('should decode nils correctly', () => {
    const val = decodeType(Buffer.from('30', 'hex'), [])
    assert.strictEqual(val, null)
  })

  it('should decode numbers correctly', () => {
    const val1 = decodeType(Buffer.from('6902d204', 'hex'), [])
    assert.strictEqual(val1, 1234)

    const val2 = decodeType(Buffer.from('69fe2efb', 'hex'), [])
    assert.strictEqual(val2, -1234)

    const val3 = decodeType(Buffer.from('6609332e3134', 'hex'), [])
    assert.strictEqual(val3, 3.14)

    const val4 = decodeType(Buffer.from('660a2d332e3134', 'hex'), [])
    assert.strictEqual(val4, -3.14)
  })

  it('should decode symbols correctly', () => {
    const symcache = []

    const val1 = decodeType(Buffer.from('3a0974657374', 'hex'), symcache)
    assert.strictEqual(val1, 'test')
    assert.deepStrictEqual(symcache, ['test'])

    const val2 = decodeType(Buffer.from('3a0974657374', 'hex'), symcache)
    assert.strictEqual(val2, 'test')
    assert.deepStrictEqual(symcache, ['test'])
  })

  it('should decode symbol links correctly', () => {
    const symcache = ['test', 'foo', 'bar', 'beta']
    const val = decodeType(Buffer.from('3b08', 'hex'), symcache)
    assert.strictEqual(val, 'beta')
  })

  it('should decode ivars correctly', () => {
    const symcache = []
    const val = decodeType(Buffer.from('49220a68656c6c6f073a0645543a0a407465737430', 'hex'), symcache)
    assert.strictEqual(val, 'hello')
    assert.deepStrictEqual(symcache, ['E', '@test'])
  })

  it('should decode objects correctly', () => {
    const symcache = []
    const val = decodeType(Buffer.from('7b063a097465737469017b', 'hex'), symcache)
    assert.deepStrictEqual(val, { test: 123 })
    assert.deepStrictEqual(symcache, ['test'])
  })

  it('should decode arrays correctly', () => {
    const val = decodeType(Buffer.from('5b0a6908690a690c69017d69febcfe', 'hex'), [])
    assert.deepStrictEqual(val, [3, 5, 7, 125, -324])
  })

  it('should call itself properly on complex types', () => {
    const buffer = Buffer.from('5b0b3a0a68656c6c6f69115b0869083b003a09746573747b083b06' +
      '54492209736f6d65063a0645547b073b00303a066e69083a066d7b063a' +
      '0676465b0669067b063a066149220662063b0754', 'hex')
    const symcache = []
    const val = decodeType(buffer, symcache)
    assert.deepStrictEqual(val, [
      'hello',
      12,
      [3, 'hello', 'test'],
      { test: true, some: { hello: null, n: 3 }, m: { v: false } },
      [1],
      { a: 'b' }
    ])
    assert.deepStrictEqual(symcache, ['hello', 'test', 'E', 'n', 'm', 'v', 'a'])
  })

  it('should throw on unsupported type', () => {
    assert.throws(
      () => decodeType(Buffer.from('6d0f456e756d657261626c65', 'hex'), []),
      new Error('ERR_MARSHAL_TYPE_NOT_SUPPORTED: 109') // 6d = 'm' -> module
    )
  })

  it('should decode byte lengths of strings correctly', () => {
    const { len } = decodeType(Buffer.from('220974657374', 'hex'), [], true)
    assert.strictEqual(len, 5)
  })

  it('should decode byte lengths of booleans correctly', () => {
    const { len: len1 } = decodeType(Buffer.from('54', 'hex'), [], true)
    assert.strictEqual(len1, 0)

    const { len: len2 } = decodeType(Buffer.from('46', 'hex'), [], true)
    assert.strictEqual(len2, 0)
  })

  it('should decode byte lengths of nils correctly', () => {
    const { len } = decodeType(Buffer.from('30', 'hex'), [], true)
    assert.strictEqual(len, 0)
  })

  it('should decode byte lengths of numbers correctly', () => {
    const { len: len1 } = decodeType(Buffer.from('6902d204', 'hex'), [], true)
    assert.strictEqual(len1, 3)

    const { len: len2 } = decodeType(Buffer.from('69fe2efb', 'hex'), [], true)
    assert.strictEqual(len2, 3)

    const { len: len3 } = decodeType(Buffer.from('6609332e3134', 'hex'), [], true)
    assert.strictEqual(len3, 5)

    const { len: len4 } = decodeType(Buffer.from('660a2d332e3134', 'hex'), [], true)
    assert.strictEqual(len4, 6)
  })

  it('should decode byte lengths of symbols correctly', () => {
    const { len } = decodeType(Buffer.from('3a0974657374', 'hex'), [], true)
    assert.strictEqual(len, 5)
  })

  it('should decode byte lengths of symbol links correctly', () => {
    const { len } = decodeType(Buffer.from('3b08', 'hex'), [], true)
    assert.strictEqual(len, 1)
  })

  it('should decode byte lengths of ivars correctly', () => {
    const { len } = decodeType(Buffer.from('49220a68656c6c6f073a0645543a0a407465737430', 'hex'), [], true)
    assert.strictEqual(len, 20)
  })

  it('should decode byte lengths of objects correctly', () => {
    const { len } = decodeType(Buffer.from('7b063a097465737469017b', 'hex'), [], true)
    assert.deepStrictEqual(len, 10)
  })

  it('should decode byte lengths of arrays correctly', () => {
    const { len } = decodeType(Buffer.from('5b0a6908690a690c69017d69febcfe', 'hex'), [], true)
    assert.deepStrictEqual(len, 14)
  })

  it('should decode byte lengths of complex types correctly', () => {
    const buffer = Buffer.from('5b0b3a0a68656c6c6f69115b0869083b003a09746573747b083b06' +
      '54492209736f6d65063a0645547b073b00303a066e69083a066d7b063a' +
      '0676465b0669067b063a066149220662063b0754', 'hex')
    const { len } = decodeType(buffer, [], true)
    assert.deepStrictEqual(len, 75)
  })
})
