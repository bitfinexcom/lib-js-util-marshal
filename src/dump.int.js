'use strict'

const { SIZEOF_LONG, MAX_INT_NEG, MAX_INT_POS } = require('./constants')

/**
 * @param {number} num
 * @returns {Buffer}
 */
const dumpInt = (num) => {
  const head = Buffer.from('i', 'utf8')

  if (num === 0) {
    return Buffer.concat([
      head,
      Buffer.from([0])
    ])
  }

  if (num > 0 && num < 123) {
    return Buffer.concat([
      head,
      Buffer.from([num + 5])
    ])
  }

  if (num > -124 && num < 0) {
    return Buffer.concat([
      head,
      Buffer.from([(num - 5) & 0xFF])
    ])
  }

  if (num > MAX_INT_POS || num < MAX_INT_NEG) {
    throw new Error('ERR_MARSHAL_INT_OVERFLOW')
  }

  const buff = [0]
  for (let i = 1; i < SIZEOF_LONG + 1; i++) {
    buff[i] = num & 0xFF
    num = num >> 8

    if (num === 0) {
      buff[0] = i
      break
    }

    if (num === -1) {
      buff[0] = -i
      break
    }
  }

  return Buffer.concat([
    head,
    Buffer.from(buff)
  ])
}

module.exports = dumpInt
