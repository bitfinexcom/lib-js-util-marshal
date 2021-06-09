'use strict'

const dumpInt = require('./dump.int')

/**
 * @param {number} pos
 * @returns {Buffer}
 */
const dumpSymbolLink = (pos) => {
  const posByte = dumpInt(pos).slice(1)

  return Buffer.concat([
    Buffer.from(';', 'utf8'),
    posByte
  ])
}

module.exports = dumpSymbolLink
