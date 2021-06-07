/* eslint-env mocha */

'use strict'

const assert = require('assert')
const dump = require('../src/dump')
const { hasRuby, loadRuby } = require('./utils')

describe('dump tests with ruby', () => {
  before(async function () {
    const ruby = await hasRuby()
    if (!ruby) {
      console.log('skip ruby tests since ruby is not installed')
      this.skip()
    }
  })

  it('should work with strings correctly', async function () {
    const d = dump('test')
    const res = await loadRuby(d)
    assert.strictEqual(res, '"test"')
  })

  it('should work with booleans correctly', async function () {
    const d1 = dump(true)
    const res1 = await loadRuby(d1)
    assert.strictEqual(res1, 'true')

    const d2 = dump(false)
    const res2 = await loadRuby(d2)
    assert.strictEqual(res2, 'false')
  })

  it('should work with nils correctly', async function () {
    const d = dump(null)
    const res = await loadRuby(d)
    assert.strictEqual(res, 'nil')
  })

  it('should work with numbers correctly', async function () {
    const d1 = dump(1234)
    const res1 = await loadRuby(d1)
    assert.strictEqual(res1, '1234')

    const d2 = dump(-1234)
    const res2 = await loadRuby(d2)
    assert.strictEqual(res2, '-1234')

    const d3 = dump(3.14)
    const res3 = await loadRuby(d3)
    assert.strictEqual(res3, '3.14')

    const d4 = dump(-3.14)
    const res4 = await loadRuby(d4)
    assert.strictEqual(res4, '-3.14')
  })

  it('should work with symbols correctly', async function () {
    const d = dump(Symbol('test'))
    const res = await loadRuby(d)
    assert.strictEqual(res, ':test')
  })

  it('should work with objects correctly', async function () {
    const d = dump({ test: 123 })
    const res = await loadRuby(d)
    assert.strictEqual(res, '{:test=>123}')
  })

  it('should work with arrays correctly', async function () {
    const d = dump([3, 5, 7, 125, -324])
    const res = await loadRuby(d)
    assert.strictEqual(res, '[3, 5, 7, 125, -324]')
  })

  it('should work with complex types correctly', async function () {
    const d = dump({
      foo: 'bar',
      1: true,
      data: [
        'a', null, false, -3.14,
        [1, 2, { name: 'joe' }]
      ]
    })
    const res = await loadRuby(d)
    assert.strictEqual(res, '{:"1"=>true, :foo=>"bar", :data=>["a", nil, false, -3.14, [1, 2, {:name=>"joe"}]]}')
  })
})
