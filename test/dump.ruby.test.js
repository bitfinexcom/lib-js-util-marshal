'use strict'

const test = require('brittle')
const dump = require('../src/dump')
const { hasRuby, loadRuby } = require('./utils')

const ruby = hasRuby()
if (!ruby) console.log('skip ruby tests since ruby is not installed')

test('dump tests with ruby - should work with strings correctly', { skip: !ruby }, async (t) => {
  const d = dump('test')
  const res = await loadRuby(d)
  t.is(res, '"test"')
})

test('dump tests with ruby - should work with booleans correctly', { skip: !ruby }, async (t) => {
  const d1 = dump(true)
  const res1 = await loadRuby(d1)
  t.is(res1, 'true')

  const d2 = dump(false)
  const res2 = await loadRuby(d2)
  t.is(res2, 'false')
})

test('dump tests with ruby - should work with nils correctly', { skip: !ruby }, async (t) => {
  const d = dump(null)
  const res = await loadRuby(d)
  t.is(res, 'nil')
})

test('dump tests with ruby - should work with numbers correctly', { skip: !ruby }, async (t) => {
  const d1 = dump(1234)
  const res1 = await loadRuby(d1)
  t.is(res1, '1234')

  const d2 = dump(-1234)
  const res2 = await loadRuby(d2)
  t.is(res2, '-1234')

  const d3 = dump(3.14)
  const res3 = await loadRuby(d3)
  t.is(res3, '3.14')

  const d4 = dump(-3.14)
  const res4 = await loadRuby(d4)
  t.is(res4, '-3.14')
})

test('dump tests with ruby - should work with symbols correctly', { skip: !ruby }, async (t) => {
  const d = dump(Symbol('test'))
  const res = await loadRuby(d)
  t.is(res, ':test')
})

test('dump tests with ruby - should work with objects correctly', { skip: !ruby }, async (t) => {
  const d = dump({ test: 123 })
  const res = await loadRuby(d)
  t.is(res, '{:test=>123}')
})

test('dump tests with ruby - should work with arrays correctly', { skip: !ruby }, async (t) => {
  const d = dump([3, 5, 7, 125, -324])
  const res = await loadRuby(d)
  t.is(res, '[3, 5, 7, 125, -324]')
})

test('dump tests with ruby - should work with complex types correctly', { skip: !ruby }, async (t) => {
  const d = dump({
    foo: 'bar',
    1: true,
    data: [
      'a', null, false, -3.14,
      [1, 2, { name: 'joe' }]
    ]
  })
  const res = await loadRuby(d)
  t.is(res, '{:"1"=>true, :foo=>"bar", :data=>["a", nil, false, -3.14, [1, 2, {:name=>"joe"}]]}')
})
