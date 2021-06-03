/* eslint-env mocha */

'use strict'

const assert = require('assert')
const { dumpHash } = require('../src/dump.complex')

describe('dumpHash tests', () => {
  it('should work with empty objects', () => {
    const d = dumpHash({}, [])
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '7b00')
  })

  it('should work with simple objects', () => {
    const d = dumpHash({ foo: 'bar' }, [])
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), '7b063a08666f6f2208626172')
  })

  it('should work with mixed objects', () => {
    const expected = '7b083a08666f6f22086261723a0974657374543a0a6974656d735b08690669f830'
    const d = dumpHash({ foo: 'bar', test: true, items: [1, -3, null] }, [])
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), expected)
  })

  it('should cache keys and symbols as symbol links', () => {
    const expected = '7b083a0974657374463a09686173683b003a0a76616c756569fe00fc'
    const symcache = []
    const d = dumpHash(
      { test: false, hash: Symbol('test'), value: -1024 },
      symcache
    )
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), expected)
    assert.deepStrictEqual(symcache, ['test', 'hash', 'value'])
  })

  it('should work with nested objects', () => {
    const expected = '7b093a096e616d65220a766967616e3a08616765691f3a09636379735b' +
      '07220862746322086574683a0a62646174657b083a09796561726902c6' +
      '073a0a6d6f6e746869063a086461796906'
    const symcache = []
    const d = dumpHash(
      {
        name: 'vigan',
        age: 26,
        ccys: ['btc', 'eth'],
        bdate: { year: 1990, month: 1, day: 1 }
      },
      symcache
    )
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), expected)
    assert.deepStrictEqual(symcache, ['name', 'age', 'ccys', 'bdate', 'year', 'month', 'day'])
  })

  it('should work with complex structures', () => {
    const expected = '7b0b3a063169073a0d746573742d76616c691c3a08666f6f7b063a0862' +
      '6172303a0a76616c75655b086906690769083a096d61736b7b093a0968' +
      '617368220c74657374696e673a0873796d3a06743a0876617222003a07' +
      '74737b083a09646174656902c9073a0a6d6f6e746822084a616e3a0a6d' +
      '6963726f5b086906690769003a096d61726b3b07'
    const expectedSymCache = [
      '1', 'test-val', 'foo', 'bar', 'value', 'mask', 'hash', 'sym', 't', 'var',
      'ts', 'date', 'month', 'micro', 'mark'
    ]
    const symcache = []
    const d = dumpHash(
      {
        'test-val': 23,
        foo: { bar: null },
        1: 2,
        value: [1, 2, 3],
        mask: { hash: 'testing', sym: Symbol('t'), var: '', ts: { date: 1993, month: 'Jan', micro: [1, 2, 0] } },
        mark: Symbol('foo')
      },
      symcache
    )
    assert.strictEqual(d instanceof Buffer, true)
    assert.strictEqual(d.toString('hex'), expected)
    assert.deepStrictEqual(symcache, expectedSymCache)
  })
})
