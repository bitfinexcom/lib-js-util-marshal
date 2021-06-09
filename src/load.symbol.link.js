'use strict'

const loadInt = require('./load.int')

/**
 * @param {Buffer} buff
 * @param {Array<string>} symcache
 * @param {boolean} [retlen]
 * @returns {string | { value: string, len: number }}
 */
const loadSymbolLink = (buff, symcache, retlen = false) => {
  const { value: index, len } = loadInt(buff, true)

  const value = symcache[index]
  return retlen ? { value, len } : value
}

module.exports = loadSymbolLink
