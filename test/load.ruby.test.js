/* eslint-env mocha */

'use strict'

const assert = require('assert')
const load = require('../src/load')
const { hasRuby, dumpRuby } = require('./utils')

describe('load tests with ruby', () => {
  before(async function () {
    const ruby = await hasRuby()
    if (!ruby) {
      console.log('skip ruby tests since ruby is not installed')
      this.skip()
    }
  })

  it('should decode strings correctly', async function () {
    const val = load(await dumpRuby('"test"'))
    assert.strictEqual(val, 'test')
  })

  it('should decode booleans correctly', async function () {
    const val1 = load(await dumpRuby('true'))
    assert.strictEqual(val1, true)

    const val2 = load(await dumpRuby('false'))
    assert.strictEqual(val2, false)
  })

  it('should decode nils correctly', async function () {
    const val = load(await dumpRuby('nil'))
    assert.strictEqual(val, null)
  })

  it('should decode numbers correctly', async function () {
    const val1 = load(await dumpRuby('1234'))
    assert.strictEqual(val1, 1234)

    const val2 = load(await dumpRuby('-1234'))
    assert.strictEqual(val2, -1234)

    const val3 = load(await dumpRuby('3.14'))
    assert.strictEqual(val3, 3.14)

    const val4 = load(await dumpRuby('-3.14'))
    assert.strictEqual(val4, -3.14)
  })

  it('should decode symbols correctly', async function () {
    const val = load(await dumpRuby(':test'))
    assert.strictEqual(val, 'test')
  })

  it('should decode ivars correctly', async function () {
    const val = load(await dumpRuby('"hello"'))
    assert.strictEqual(val, 'hello')
  })

  it('should decode objects correctly', async function () {
    const val1 = load(await dumpRuby('{test: 123}'))
    assert.deepStrictEqual(val1, { test: 123 })

    const val2 = load(await dumpRuby('{"test" => 123 }'))
    assert.deepStrictEqual(val2, { test: 123 })

    const val3 = load(await dumpRuby('{ :test => 123 }'))
    assert.deepStrictEqual(val3, { test: 123 })
  })

  it('should decode arrays correctly', async function () {
    const val = load(await dumpRuby('[3, 5, 7, 125, -324]'))
    assert.deepStrictEqual(val, [3, 5, 7, 125, -324])
  })

  it('should call itself properly on complex types', async function () {
    const rubyObj = '[:hello, 12, [3, :hello, :test], { :test => true, "some" => { :hello => nil, \'n\': 3 }, \'m\': { v: false}}, [1], { \'a\': "b"}]'
    const val = load(await dumpRuby(rubyObj))
    assert.deepStrictEqual(val, [
      'hello',
      12,
      [3, 'hello', 'test'],
      { test: true, some: { hello: null, n: 3 }, m: { v: false } },
      [1],
      { a: 'b' }
    ])
  })
})
