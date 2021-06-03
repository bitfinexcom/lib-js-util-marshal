/* eslint-env mocha */

'use strict'

const assert = require('assert')
const { encodeType } = require('../src/dump.complex')

describe('encodeType tests', () => {
  it('should encode strings correctly', () => {
    const d = encodeType('test', [])
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '220974657374')
  })

  it('should encode booleans correctly', () => {
    const d1 = encodeType(true, [])
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '54')

    const d2 = encodeType(false, [])
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '46')
  })

  it('should encode nils correctly', () => {
    const d1 = encodeType(null, [])
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '30')

    const d2 = encodeType(undefined, [])
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '30')
  })

  it('should encode numbers correctly', () => {
    const d1 = encodeType(1234, [])
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '6902d204')

    const d2 = encodeType(-1234, [])
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '69fe2efb')

    const d3 = encodeType(3.14, [])
    assert.strictEqual(d3 instanceof Buffer, true)
    assert.strictEqual(d3.toString('hex'), '6609332e3134')

    const d4 = encodeType(-3.14, [])
    assert.strictEqual(d4 instanceof Buffer, true)
    assert.strictEqual(d4.toString('hex'), '660a2d332e3134')
  })

  it('should encode symbols correctly', () => {
    const symcache = []

    const d1 = encodeType(Symbol('test'), symcache)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '3a0974657374')
    assert.deepStrictEqual(symcache, ['test'])

    const d2 = encodeType(Symbol('test'), symcache)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '3b00')
    assert.deepStrictEqual(symcache, ['test'])
  })

  it('should encode objects correctly', () => {
    const symcache = []
    const d = encodeType({ test: 123 }, symcache)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '7b063a097465737469017b')
    assert.deepStrictEqual(symcache, ['test'])
  })

  it('should encode arrays correctly', () => {
    const d = encodeType([3, 5, 7, 125, -324], [])
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '5b0a6908690a690c69017d69febcfe')
  })

  it('should call itself properly on complex types', () => {
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
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), expected)
    assert.deepStrictEqual(symcache, ['1', 'foo', 'data', 'name'])
  })

  it('should throw on unsupported type', () => {
    assert.throws(
      () => encodeType(BigInt('9007199254740991'), []),
      new Error('ERR_MARSHAL_TYPE_NOT_SUPPORTED')
    )
  })
})
