'use strict'

const loadFloat = require('./load.float')
const loadInt = require('./load.int')
const loadString = require('./load.string')
const loadSymbolLink = require('./load.symbol.link')

const {
  T_NULL, T_TRUE, T_FALSE, T_INT, T_FLOAT,
  T_STRING, T_SYMBOL, T_HASH, T_ARRAY,
  T_IVAR, T_SYMBOL_LINK, STR_ENCODINGS
} = require('./constants')

/**
 * @param {Buffer} buff
 * @param {Array<string>} symcache
 * @param {boolean} [retlen]
 * @returns {Array<any>  | { value: Array<any>, len: number }}
 */
const loadArray = (buff, symcache, retlen = false) => {
  const { value: arrlen, len: arrCountBytes } = loadInt(buff, true)
  const start = arrCountBytes

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
  const { value: maplen, len: mapCountBytes } = loadInt(buff, true)
  const start = mapCountBytes

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
  const { value: strlen, len: strCountBytes } = loadInt(strchunk, true)
  const strstart = strCountBytes
  const strend = strstart + strlen

  const varchunk = buff.slice(strend + 1)
  const { value: varlen, len: varCountBytes } = loadInt(varchunk, true)
  const varstart = varCountBytes

  const raw = varchunk.slice(varstart)
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

  let rubyEnc
  if (keys.includes('E')) rubyEnc = data.E ? 'UTF-8' : 'US-ASCII'
  if (keys.includes('encoding')) rubyEnc = data.encoding.toUpperCase()
  if (!STR_ENCODINGS[rubyEnc]) throw new Error('ERR_MARSHAL_STR_ENCODING_NOT_SUPPORTED')

  const str = loadString(strchunk, false, STR_ENCODINGS[rubyEnc])
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
