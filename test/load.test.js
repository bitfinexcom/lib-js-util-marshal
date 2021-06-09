/* eslint-env mocha */

'use strict'

const assert = require('assert')
const load = require('../src/load')

describe('load tests', () => {
  it('should decode strings correctly', () => {
    const val = load(Buffer.from('0408220974657374', 'hex'))
    assert.strictEqual(val, 'test')
  })

  it('should decode booleans correctly', () => {
    const val1 = load(Buffer.from('040854', 'hex'))
    assert.strictEqual(val1, true)

    const val2 = load(Buffer.from('040846', 'hex'))
    assert.strictEqual(val2, false)
  })

  it('should decode nils correctly', () => {
    const val = load(Buffer.from('040830', 'hex'))
    assert.strictEqual(val, null)
  })

  it('should decode numbers correctly', () => {
    const val1 = load(Buffer.from('04086902d204', 'hex'))
    assert.strictEqual(val1, 1234)

    const val2 = load(Buffer.from('040869fe2efb', 'hex'))
    assert.strictEqual(val2, -1234)

    const val3 = load(Buffer.from('04086609332e3134', 'hex'))
    assert.strictEqual(val3, 3.14)

    const val4 = load(Buffer.from('0408660a2d332e3134', 'hex'))
    assert.strictEqual(val4, -3.14)
  })

  it('should decode symbols correctly', () => {
    const val = load(Buffer.from('04083a0974657374', 'hex'))
    assert.strictEqual(val, 'test')
  })

  it('should decode ivars correctly', () => {
    const val = load(Buffer.from('040849220a68656c6c6f073a0645543a0a407465737430', 'hex'))
    assert.strictEqual(val, 'hello')
  })

  it('should decode objects correctly', () => {
    const val = load(Buffer.from('04087b063a097465737469017b', 'hex'))
    assert.deepStrictEqual(val, { test: 123 })
  })

  it('should decode arrays correctly', () => {
    const val = load(Buffer.from('04085b0a6908690a690c69017d69febcfe', 'hex'))
    assert.deepStrictEqual(val, [3, 5, 7, 125, -324])
  })

  it('should call itself properly on complex types', () => {
    const buffer = Buffer.from('04085b0b3a0a68656c6c6f69115b0869083b003a09746573747b083b06' +
      '54492209736f6d65063a0645547b073b00303a066e69083a066d7b063a' +
      '0676465b0669067b063a066149220662063b0754', 'hex')
    const val = load(buffer)
    assert.deepStrictEqual(val, [
      'hello',
      12,
      [3, 'hello', 'test'],
      { test: true, some: { hello: null, n: 3 }, m: { v: false } },
      [1],
      { a: 'b' }
    ])
  })

  it('should throw on unsupported type', () => {
    assert.throws(
      () => load(Buffer.from('04086d0f456e756d657261626c65', 'hex')),
      new Error('ERR_MARSHAL_TYPE_NOT_SUPPORTED: 109') // 6d = 'm' -> module
    )
  })

  it('should throw on unsupported version', () => {
    assert.throws(
      () => load(Buffer.from('040749220a68656c6c6f063a064554', 'hex')),
      new Error('ERR_MARSHAL_VERSION_NOT_SUPPORTED') // 6d = 'm' -> module
    )
  })
})
