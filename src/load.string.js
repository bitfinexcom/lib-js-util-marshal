'use strict'

const loadInt = require('./load.int')

/**
 * @param {Buffer} buff
 * @param {boolean} [retlen]
 * @param {string} [enc]
 * @returns {string | { value: string, len: number }}
 */
const loadString = (buff, retlen = false, enc = 'utf8') => {
  const { value: strlen, len: strCountBytes } = loadInt(buff, true)
  const start = strCountBytes
  const end = start + strlen // length bytes + char content bytes

  const value = buff.slice(start, end).toString(enc)
  return retlen ? { value, len: end } : value
}

module.exports = loadString
