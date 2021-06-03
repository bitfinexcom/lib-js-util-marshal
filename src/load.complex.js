'use strict'

const loadFloat = require('./load.float')
const loadInt = require('./load.int')
const loadString = require('./load.string')
const loadSymbolLink = require('./load.symbol.link')

const {
  T_NULL, T_TRUE, T_FALSE, T_INT, T_FLOAT,
  T_STRING, T_SYMBOL, T_HASH, T_ARRAY,
  T_IVAR, T_SYMBOL_LINK
} = require('./constants')

/**
 * @param {Buffer} buff
 * @param {Array<string>} symcache
 * @param {boolean} [retlen]
 * @returns {Array<any>  | { value: Array<any>, len: number }}
 */
const loadArray = (buff, symcache, retlen = false) => {
  const arrlen = loadInt(buff)
  const first = buff.readInt8(0)
  let start = 1 // short int, simply skip 1
  if (first > -6 && first < 6) start = first + 1 // 2-4 byte int, get num of bytes + 1

  const raw = buff.slice(start)
  const data = []

  let byteIndex = 0
  for (let i = 0; i < arrlen; i++) {
    const elem = raw.slice(byteIndex)
    const { value: item, len: itemLen } = decodeType(elem, symcache, true)
    data.push(item)
    byteIndex += 1 // skip type char
    byteIndex += itemLen // skip item content
  }
  const len = start + byteIndex // length bytes + array content bytes

  return retlen ? { value: data, len } : data
}

/**
 * @param {Buffer} buff
 * @param {Array<string>} symcache
 * @param {boolean} [retlen]
 * @returns {Object<string, any>  | { value: Object<string, any>, len: number }}
 */
const loadHash = (buff, symcache, retlen = false) => {
  const maplen = loadInt(buff)
  const first = buff.readInt8(0)
  let start = 1 // short int, simply skip 1
  if (first > -6 && first < 6) start = first + 1 // 2-4 byte int, get num of bytes + 1

  const raw = buff.slice(start)
  const data = {}

  let byteIndex = 0
  for (let i = 0; i < maplen; i++) {
    const keyElem = raw.slice(byteIndex)
    const { value: key, len: keyLen } = decodeType(keyElem, symcache, true)
    byteIndex += 1 // skip type char
    byteIndex += keyLen // skip key content

    const valueElem = raw.slice(byteIndex)
    const { value: item, len: itemLen } = decodeType(valueElem, symcache, true)
    byteIndex += 1 // skip type char
    byteIndex += itemLen // skip item content

    data[key] = item
  }
  const len = start + byteIndex // length bytes + map content bytes

  return retlen ? { value: data, len } : data
}

/**
 * @param {Buffer} buff
 * @param {Array<string>} symcache
 * @param {boolean} [retlen]
 * @returns {string | { value: string, len: number }}
 */
const loadIVAR = (buff, symcache, retlen = false) => {
  const strchunk = buff.slice(1) // first byte is '"'
  const strlen = loadInt(strchunk)
  const strfirst = strchunk.readInt8(0)
  let strstart = 1 // short int, simply skip 1
  if (strfirst > -6 && strfirst < 6) strstart = strfirst + 1 // 2-4 byte int, get num of bytes + 1
  const strend = strstart + strlen

  const varchunk = buff.slice(strend + 1)
  const varlen = loadInt(varchunk)
  const varfirst = varchunk.readInt8(0)
  let varstart = 1 // short int, simply skip 1
  if (varfirst > -6 && varfirst < 6) varstart = varfirst + 1 // 2-4 byte int, get num of bytes + 1

  const raw = varchunk.slice(1)
  const data = {}
  const keys = []

  let byteIndex = 0
  for (let i = 0; i < varlen; i++) {
    const keyElem = raw.slice(byteIndex)
    const { value: key, len: keyLen } = decodeType(keyElem, symcache, true)
    byteIndex += 1 // skip type char
    byteIndex += keyLen // skip key content

    const valueElem = raw.slice(byteIndex)
    const { value: item, len: itemLen } = decodeType(valueElem, symcache, true)
    byteIndex += 1 // skip type char
    byteIndex += itemLen // skip item content

    data[key] = item
    keys.push(key)
  }

  let enc = 'utf8'
  if (keys.includes('E')) enc = data.E ? 'utf8' : 'ascii'
  if (keys.includes('encoding')) enc = data.encoding

  const str = loadString(strchunk, false, enc)
  const len = strend + varstart + byteIndex + 1 // string content + var count + var byte length + '"'

  return retlen ? { value: str, len } : str
}

/**
 * @param {Buffer} buff
 * @param {Array<string>} symcache
 * @param {boolean} [retlen]
 * @returns {any | { value: any, len: number }}
 */
const decodeType = (buff, symcache, retlen = false) => {
  const type = buff[0]
  let res, symbol

  switch (type) {
    case T_SYMBOL:
      res = loadString(buff.slice(1), retlen)
      symbol = typeof res === 'string' ? res : res.value
      if (!symcache.includes(symbol)) symcache.push(symbol)
      return res
    case T_STRING: return loadString(buff.slice(1), retlen)
    case T_TRUE: return retlen ? { value: true, len: 0 } : true // len is 0 since there's no byte after type symbol
    case T_FALSE: return retlen ? { value: false, len: 0 } : false
    case T_INT: return loadInt(buff.slice(1), retlen)
    case T_FLOAT: return loadFloat(buff.slice(1), retlen)
    case T_NULL: return retlen ? { value: null, len: 0 } : null
    case T_ARRAY: return loadArray(buff.slice(1), symcache, retlen)
    case T_HASH: return loadHash(buff.slice(1), symcache, retlen)
    case T_IVAR: return loadIVAR(buff.slice(1), symcache, retlen)
    case T_SYMBOL_LINK: return loadSymbolLink(buff.slice(1), symcache, retlen)
    default: throw new Error('ERR_MARSHAL_TYPE_NOT_SUPPORTED: ' + type)
  }
}

module.exports = {
  decodeType,
  loadArray,
  loadHash,
  loadIVAR
}
