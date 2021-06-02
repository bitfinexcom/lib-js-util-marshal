'use strict'

/**
 * @param {Buffer} buff
 * @param {boolean} [retlen]
 * @returns {number | { value: number, len: number }}
 */
const loadInt = (buff, retlen = false) => {
  const first = buff.readInt8(0)
  let value, len

  if (first === 0) {
    value = 0
    len = 1
  } else if (first >= 6) {
    value = first - 5 // 1 becomes 6 due to num + 5
    len = 1
  } else if (first <= -6) {
    value = first + 5 // -1 becomes -6 due to num - 5
    len = 1
  } else {
    // possible byte lengths [-4, 4]
    const abs = Math.abs(first)
    const sign = first / abs // -1 or 1

    value = sign > 0 ? 0 : 0xFFFFFFFF
    for (let i = abs; i >= 1; i--) {
      value = value << 8
      value = value | buff[i]
    }

    len = abs + 1 // 4 byte integer is represented through 5 bytes
  }

  return retlen ? { value, len } : value
}

module.exports = loadInt
