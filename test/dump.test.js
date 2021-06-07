/* eslint-env mocha */

'use strict'

const assert = require('assert')
const dump = require('../src/dump')

describe('dump tests', () => {
  it('should encode strings correctly', () => {
    const d = dump('test')
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '0408220974657374')
  })

  it('should encode booleans correctly', () => {
    const d1 = dump(true)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '040854')

    const d2 = dump(false)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '040846')
  })

  it('should encode nils correctly', () => {
    const d = dump(null)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '040830')
  })

  it('should encode numbers correctly', () => {
    const d1 = dump(1234)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '04086902d204')

    const d2 = dump(-1234)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '040869fe2efb')

    const d3 = dump(3.14)
    assert.strictEqual(d3 instanceof Buffer, true)
    assert.strictEqual(d3.toString('hex'), '04086609332e3134')

    const d4 = dump(-3.14)
    assert.strictEqual(d4 instanceof Buffer, true)
    assert.strictEqual(d4.toString('hex'), '0408660a2d332e3134')
  })

  it('should encode symbols correctly', () => {
    const d1 = dump(Symbol('test'))
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '04083a0974657374')
  })

  it('should encode objects correctly', () => {
    const d = dump({ test: 123 })
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '04087b063a097465737469017b')
  })

  it('should encode arrays correctly', () => {
    const d = dump([3, 5, 7, 125, -324])
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '04085b0a6908690a690c69017d69febcfe')
  })

  it('should work properly on complex types', () => {
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
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), expected)
  })
})
