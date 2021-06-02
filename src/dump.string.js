'use strict'

const dumpInt = require('./dump.int')

/**
 * @param {string} str
 * @returns {Buffer}
 */
const dumpString = (str) => {
  const len = dumpInt(str.length).slice(1)

  return Buffer.concat([
    Buffer.from('"', 'utf8'),
    len,
    Buffer.from(str, 'utf8')
  ])
}

module.exports = dumpString
