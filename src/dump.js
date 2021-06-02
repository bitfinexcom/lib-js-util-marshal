'use strict'

const { encodeType } = require('./dump.complex')

/**
 * @param {any} val
 * @param {Array<number>} ver
 * @returns {Buffer}
 */
const dump = (val, ver = [4, 8]) => {
  return Buffer.concat([
    Buffer.from(ver),
    encodeType(val)
  ])
}

module.exports = dump
