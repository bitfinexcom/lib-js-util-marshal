'use strict'

const dumpBool = require('./dump.bool')
const dumpFloat = require('./dump.float')
const dumpInt = require('./dump.int')
const dumpNull = require('./dump.null')
const dumpString = require('./dump.string')
const dumpSymbol = require('./dump.symbol')
const dumpSymbolLink = require('./dump.symbol.link')

/**
 * @param {string} symbol
 * @param {Array<string>} symcache
 * @returns {Buffer}
 */
const dumpSymbolOrLink = (symbol, symcache) => {
  const pos = symcache.indexOf(symbol)
  if (pos === -1) {
    symcache.push(symbol)
    return dumpSymbol(symbol)
  }

  return dumpSymbolLink(pos)
}

/**
 * @param {Array} arr
 * @param {Array<string>} symcache
 * @returns {Buffer}
 */
const dumpArray = (arr, symcache) => {
  const head = Buffer.from('[', 'utf8')
  const len = dumpInt(arr.length).slice(1)
  const data = []

  for (const val of arr) {
    data.push(encodeType(val, symcache))
  }

  return Buffer.concat([
    head,
    len,
    ...data
  ])
}

/**
 * @param {Object} obj
 * @param {Array<string>} symcache
 * @returns {Buffer}
 */
const dumpHash = (obj, symcache) => {
  const head = Buffer.from('{', 'utf8')
  const len = dumpInt(Object.keys(obj).length).slice(1)

  const data = []
  for (const key in obj) {
    data.push(dumpSymbolOrLink(key, symcache), encodeType(obj[key], symcache))
  }

  return Buffer.concat([
    head,
    len,
    ...data
  ])
}

/**
 * @param {any} val
 * @param {Array<string>} symcache
 * @returns {Buffer}
 */
const encodeType = (val, symcache) => { // see http://jakegoulding.com/blog/2013/01/15/a-little-dip-into-rubys-marshal-format
  let symbol

  switch (typeof val) {
    case 'string': return dumpString(val)
    case 'boolean': return dumpBool(val)
    case 'number':
      if (Number.isInteger(val)) return dumpInt(val)
      return dumpFloat(val)
    case 'object':
      if (val === null) return dumpNull()
      if (Array.isArray(val)) return dumpArray(val, symcache)
      return dumpHash(val, symcache)
    case 'symbol':
      symbol = val.toString().replace('Symbol(', '').replace(')', '')
      return dumpSymbolOrLink(symbol, symcache)
    case 'undefined': // undefined or null is nil in ruby
      return dumpNull()
    default: throw new Error('ERR_MARSHAL_TYPE_NOT_SUPPORTED')
  }
}

module.exports = {
  dumpArray,
  dumpHash,
  dumpSymbolOrLink,
  encodeType
}
