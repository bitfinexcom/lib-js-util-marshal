'use strict'

const SIZEOF_LONG = 8 // 8 bytes
const MAX_INT_POS = 1073741823 // 2**30 - 1
const MAX_INT_NEG = -1073741824 // -(2**30)
const T_NULL = 0x30 // '0'
const T_TRUE = 0x54 // 'T'
const T_FALSE = 0x46 // 'F'
const T_INT = 0x69 // 'i'
const T_FLOAT = 0x66 // 'f'
const T_STRING = 0x22 // '"'
const T_SYMBOL = 0x3a // ':'
const T_HASH = 0x7b // '{'
const T_ARRAY = 0x5b // '[',
const T_IVAR = 0x49 // 'I'
const T_SYMBOL_LINK = 0x3b // ';'

const STR_ENCODINGS = {
  'UTF-8': 'utf8',
  'US-ASCII': 'ascii',
  'UTF-16LE': 'utf16le',
  'ISO-8859-1': 'latin1'
}
Object.freeze(STR_ENCODINGS)

module.exports = {
  SIZEOF_LONG,
  MAX_INT_POS,
  MAX_INT_NEG,
  T_NULL,
  T_TRUE,
  T_FALSE,
  T_INT,
  T_FLOAT,
  T_STRING,
  T_SYMBOL,
  T_HASH,
  T_ARRAY,
  T_IVAR,
  T_SYMBOL_LINK,
  STR_ENCODINGS
}
