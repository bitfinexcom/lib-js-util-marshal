/* eslint-env mocha */

'use strict'

const assert = require('assert')
const dumpInt = require('../src/dump.int')
const { MAX_INT_NEG, MAX_INT_POS } = require('../src/constants')

describe('dumpInt tests', () => {
  it('should return expected format for zero', () => {
    const d = dumpInt(0)
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '6900')
  })

  it('should return expected format for short positive ints', () => {
    const d1 = dumpInt(1)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '6906')

    const d2 = dumpInt(2)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '6907')

    const d3 = dumpInt(122)
    assert.strictEqual(d3 instanceof Buffer, true)
    assert.strictEqual(d3.toString('hex'), '697f')
  })

  it('should return expected format for short negative ints', () => {
    const d1 = dumpInt(-1)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '69fa')

    const d2 = dumpInt(-2)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '69f9')

    const d3 = dumpInt(-123)
    assert.strictEqual(d3 instanceof Buffer, true)
    assert.strictEqual(d3.toString('hex'), '6980') // 7f -> 122, 80 -> -123
  })

  it('should return expected format for 2 byte positive ints', () => {
    const d1 = dumpInt(123)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '69017b')

    const d2 = dumpInt(255)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '6901ff')
  })

  it('should return expected format for 2 byte negative ints', () => {
    const d1 = dumpInt(-124)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '69ff84')

    const d2 = dumpInt(-256)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '69ff00')
  })

  it('should return expected format for 3 byte positive ints', () => {
    const d1 = dumpInt(256)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '69020001')

    const d2 = dumpInt(65535)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '6902ffff')
  })

  it('should return expected format for 3 byte negative ints', () => {
    const d1 = dumpInt(-257)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '69fefffe')

    const d2 = dumpInt(-65536)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '69fe0000')
  })

  it('should return expected format for 4 byte positive ints', () => {
    const d1 = dumpInt(65536)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '6903000001')

    const d2 = dumpInt(16777215)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '6903ffffff')
  })

  it('should return expected format for 4 byte negative ints', () => {
    const d1 = dumpInt(-65537)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '69fdfffffe')

    const d2 = dumpInt(-16777216)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '69fd000000')
  })

  it('should return expected format for 5 byte positive ints', () => {
    const d1 = dumpInt(16777216)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '690400000001')

    const d2 = dumpInt(2 ** 30 - 1)
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '6904ffffff3f')
  })

  it('should return expected format for 5 byte positive ints', () => {
    const d1 = dumpInt(-16777217)
    assert.strictEqual(d1 instanceof Buffer, true)
    assert.strictEqual(d1.toString('hex'), '69fcfffffffe')

    const d2 = dumpInt(-(2 ** 30))
    assert.strictEqual(d2 instanceof Buffer, true)
    assert.strictEqual(d2.toString('hex'), '69fc000000c0')
  })

  it('should throw when integer is larger than max allowed values', () => {
    assert.throws(() => dumpInt(MAX_INT_POS + 1), new Error('ERR_MARSHAL_INT_OVERFLOW'))
    assert.throws(() => dumpInt(MAX_INT_NEG - 1), new Error('ERR_MARSHAL_INT_OVERFLOW'))
  })
})
