'use strict'

const loadInt = require('./load.int')

/**
 * @param {Buffer} buff
 * @param {boolean} [retlen]
 * @param {string} [enc]
 * @returns {string | { value: string, len: number }}
 */
const loadString = (buff, retlen = false, enc = 'utf8') => {
  const strlen = loadInt(buff)
  const first = buff.readInt8(0)
  let start = 1 // short int, simply skip 1
  if (first > -6 && first < 6) start = first + 1 // 2-4 byte int, get num of bytes + 1
  const end = start + strlen

  const value = buff.slice(start, end).toString(enc)
  return retlen ? { value, len: end } : value
}

module.exports = loadString
