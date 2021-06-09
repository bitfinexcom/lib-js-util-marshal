'use strict'

const dumpInt = require('./dump.int')

/**
 * @param {number} num
 * @returns {Buffer}
 */
const dumpFloat = (num) => {
  const head = Buffer.from('f', 'utf8')
  let str = ''

  if (Number.isNaN(num)) {
    str = 'nan'
  } else if (!Number.isFinite(num)) {
    str = num > 0 ? 'inf' : '-inf'
  } else {
    str = num.toString()
  }

  const len = dumpInt(str.length).slice(1)

  return Buffer.concat([
    head,
    len,
    Buffer.from(str, 'utf8')
  ])
}

module.exports = dumpFloat
