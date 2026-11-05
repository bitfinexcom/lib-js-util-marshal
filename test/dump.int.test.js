'use strict'

const test = require('brittle')
const dumpInt = require('../src/dump.int')
const { MAX_INT_NEG, MAX_INT_POS } = require('../src/constants')

test('dumpInt tests - should return expected format for zero', (t) => {
  const d = dumpInt(0)
  t.is(d instanceof Buffer, true)
  t.is(d.toString('hex'), '6900')
})

test('dumpInt tests - should return expected format for short positive ints', (t) => {
  const d1 = dumpInt(1)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '6906')

  const d2 = dumpInt(2)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '6907')

  const d3 = dumpInt(122)
  t.is(d3 instanceof Buffer, true)
  t.is(d3.toString('hex'), '697f')
})

test('dumpInt tests - should return expected format for short negative ints', (t) => {
  const d1 = dumpInt(-1)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '69fa')

  const d2 = dumpInt(-2)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '69f9')

  const d3 = dumpInt(-123)
  t.is(d3 instanceof Buffer, true)
  t.is(d3.toString('hex'), '6980') // 7f -> 122, 80 -> -123
})

test('dumpInt tests - should return expected format for 2 byte positive ints', (t) => {
  const d1 = dumpInt(123)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '69017b')

  const d2 = dumpInt(255)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '6901ff')
})

test('dumpInt tests - should return expected format for 2 byte negative ints', (t) => {
  const d1 = dumpInt(-124)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '69ff84')

  const d2 = dumpInt(-256)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '69ff00')
})

test('dumpInt tests - should return expected format for 3 byte positive ints', (t) => {
  const d1 = dumpInt(256)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '69020001')

  const d2 = dumpInt(65535)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '6902ffff')
})

test('dumpInt tests - should return expected format for 3 byte negative ints', (t) => {
  const d1 = dumpInt(-257)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '69fefffe')

  const d2 = dumpInt(-65536)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '69fe0000')
})

test('dumpInt tests - should return expected format for 4 byte positive ints', (t) => {
  const d1 = dumpInt(65536)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '6903000001')

  const d2 = dumpInt(16777215)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '6903ffffff')
})

test('dumpInt tests - should return expected format for 4 byte negative ints', (t) => {
  const d1 = dumpInt(-65537)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '69fdfffffe')

  const d2 = dumpInt(-16777216)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '69fd000000')
})

test('dumpInt tests - should return expected format for 5 byte positive ints', (t) => {
  const d1 = dumpInt(16777216)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '690400000001')

  const d2 = dumpInt(2 ** 30 - 1)
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '6904ffffff3f')
})

test('dumpInt tests - should return expected format for 5 byte positive ints', (t) => {
  const d1 = dumpInt(-16777217)
  t.is(d1 instanceof Buffer, true)
  t.is(d1.toString('hex'), '69fcfffffffe')

  const d2 = dumpInt(-(2 ** 30))
  t.is(d2 instanceof Buffer, true)
  t.is(d2.toString('hex'), '69fc000000c0')
})

test('dumpInt tests - should throw when integer is larger than max allowed values', (t) => {
  t.exception(() => dumpInt(MAX_INT_POS + 1), /ERR_MARSHAL_INT_OVERFLOW/)
  t.exception(() => dumpInt(MAX_INT_NEG - 1), /ERR_MARSHAL_INT_OVERFLOW/)
})
