'use strict'

const dumpBool = require('./dump.bool')
const dumpFloat = require('./dump.float')
const dumpInt = require('./dump.int')
const dumpNull = require('./dump.null')
const dumpString = require('./dump.string')
const dumpSymbol = require('./dump.symbol')

/**
 * @param {Array} arr
 * @returns {Buffer}
 */
const dumpArray = (arr) => {
  const head = Buffer.from('[', 'utf8')
  const len = dumpInt(arr.length).slice(1)
  const data = []

  for (const val of arr) {
    data.push(encodeType(val))
  }

  return Buffer.concat([
    head,
    len,
    ...data
  ])
}

/**
 * @param {Object} obj
 * @returns {Buffer}
 */
const dumpHash = (obj) => {
  const head = Buffer.from('{', 'utf8')
  const len = dumpInt(Object.keys(obj).length).slice(1)

  const data = []
  for (const key in obj) {
    data.push(dumpSymbol(key), encodeType(obj[key]))
  }

  return Buffer.concat([
    head,
    len,
    ...data
  ])
}

/**
 * @param {any} val
 * @returns {Buffer}
 */
const encodeType = (val) => { // see http://jakegoulding.com/blog/2013/01/15/a-little-dip-into-rubys-marshal-format
  switch (typeof val) {
    case 'string': return dumpString(val)
    case 'boolean': return dumpBool(val)
    case 'number':
      if (Number.isInteger(val)) return dumpInt(val)
      return dumpFloat(val)
    case 'object':
      if (val === null) return dumpNull()
      if (Array.isArray(val)) return dumpArray(val)
      return dumpHash(val)
    case 'symbol':
      return dumpSymbol(val.toString().replace('Symbol(', '').replace(')', ''))
    case 'undefined': // undefined or null is nil in ruby
      return dumpNull()
    default: throw new Error('ERR_MARSHAL_TYPE_NOT_SUPPORTED')
  }
}

module.exports = {
  dumpArray,
  dumpHash,
  encodeType
}
