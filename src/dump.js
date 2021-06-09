'use strict'

const { encodeType } = require('./dump.complex')

/**
 * @param {any} val
 * @param {Array<number>} ver
 * @returns {Buffer}
 */
const dump = (val, ver = [4, 8]) => {
  const symcache = []

  return Buffer.concat([
    Buffer.from(ver),
    encodeType(val, symcache)
  ])
}

module.exports = dump
