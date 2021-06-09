'use strict'

const loadString = require('./load.string')

/**
 * @param {Buffer} buff
 * @param {boolean} [retlen]
 * @returns {number | { value: number, len: number }}
 */
const loadFloat = (buff, retlen = false) => {
  const { value: str, len } = loadString(buff, true)
  let value

  if (str === 'nan') {
    value = NaN
  } else if (str === 'inf') {
    value = Infinity
  } else if (str === '-inf') {
    value = -Infinity
  } else {
    value = +str
  }

  return retlen ? { value, len } : value
}

module.exports = loadFloat
