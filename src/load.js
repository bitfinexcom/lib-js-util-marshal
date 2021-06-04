'use strict'

const { decodeType } = require('./load.complex')

/**
 * @param {Buffer} buff
 * @param {Array<number>} ver
 * @returns {any}
 */
const load = (buff, ver = [4, 8]) => {
  const head = buff.slice(0, 2)
  if (head[0] !== ver[0] || head[1] !== ver[1]) {
    throw new Error('ERR_MARSHAL_VERSION_NOT_SUPPORTED')
  }

  const symcache = []
  const retlen = false

  return decodeType(buff.slice(2), symcache, retlen)
}

module.exports = load
