'use strict'

/**
 * @param {boolean} val
 * @returns {Buffer}
 */
const dumpBool = (val) => Buffer.from(val === true ? 'T' : 'F')

module.exports = dumpBool
