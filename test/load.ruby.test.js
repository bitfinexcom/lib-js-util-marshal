'use strict'

const test = require('brittle')
const load = require('../src/load')
const { hasRuby, dumpRuby } = require('./utils')

const ruby = hasRuby()
if (!ruby) console.log('skip ruby tests since ruby is not installed')

test('load tests with ruby - should decode strings correctly', { skip: !ruby }, async (t) => {
  const val = load(await dumpRuby('"test"'))
  t.is(val, 'test')
})

test('load tests with ruby - should decode booleans correctly', { skip: !ruby }, async (t) => {
  const val1 = load(await dumpRuby('true'))
  t.is(val1, true)

  const val2 = load(await dumpRuby('false'))
  t.is(val2, false)
})

test('load tests with ruby - should decode nils correctly', { skip: !ruby }, async (t) => {
  const val = load(await dumpRuby('nil'))
  t.is(val, null)
})

test('load tests with ruby - should decode numbers correctly', { skip: !ruby }, async (t) => {
  const val1 = load(await dumpRuby('1234'))
  t.is(val1, 1234)

  const val2 = load(await dumpRuby('-1234'))
  t.is(val2, -1234)

  const val3 = load(await dumpRuby('3.14'))
  t.is(val3, 3.14)

  const val4 = load(await dumpRuby('-3.14'))
  t.is(val4, -3.14)
})

test('load tests with ruby - should decode symbols correctly', { skip: !ruby }, async (t) => {
  const val = load(await dumpRuby(':test'))
  t.is(val, 'test')
})

test('load tests with ruby - should decode ivars correctly', { skip: !ruby }, async (t) => {
  const val = load(await dumpRuby('"hello"'))
  t.is(val, 'hello')
})

test('load tests with ruby - should decode objects correctly', { skip: !ruby }, async (t) => {
  const val1 = load(await dumpRuby('{test: 123}'))
  t.alike(val1, { test: 123 })

  const val2 = load(await dumpRuby('{"test" => 123 }'))
  t.alike(val2, { test: 123 })

  const val3 = load(await dumpRuby('{ :test => 123 }'))
  t.alike(val3, { test: 123 })
})

test('load tests with ruby - should decode arrays correctly', { skip: !ruby }, async (t) => {
  const val = load(await dumpRuby('[3, 5, 7, 125, -324]'))
  t.alike(val, [3, 5, 7, 125, -324])
})

test('load tests with ruby - should call itself properly on complex types', { skip: !ruby }, async (t) => {
  const rubyObj = '[:hello, 12, [3, :hello, :test], { :test => true, "some" => { :hello => nil, \'n\': 3 }, \'m\': { v: false}}, [1], { \'a\': "b"}]'
  const val = load(await dumpRuby(rubyObj))
  t.alike(val, [
    'hello',
    12,
    [3, 'hello', 'test'],
    { test: true, some: { hello: null, n: 3 }, m: { v: false } },
    [1],
    { a: 'b' }
  ])
})
