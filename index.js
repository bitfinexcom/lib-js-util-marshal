'use strict'

const CONSTANTS = require('./src/constants')
const dump = require('./src/dump')
const dumpBool = require('./src/dump.bool')
const dumpComplex = require('./src/dump.complex')
const dumpFloat = require('./src/dump.float')
const dumpInt = require('./src/dump.int')
const dumpNull = require('./src/dump.null')
const dumpString = require('./src/dump.string')
const dumpSymbol = require('./src/dump.symbol')
const dumpSymbolLink = require('./src/dump.symbol.link')
const loadComplex = require('./src/load.complex')
const load = require('./src/load')
const loadFloat = require('./src/load.float')
const loadInt = require('./src/load.int')
const loadString = require('./src/load.string')
const loadSymbolLink = require('./src/load.symbol.link')

module.exports = {
  CONSTANTS: Object.freeze(CONSTANTS),
  decodeType: loadComplex.decodeType,
  dump,
  dumpArray: dumpComplex.dumpArray,
  dumpBool,
  dumpFloat,
  dumpHash: dumpComplex.dumpHash,
  dumpInt,
  dumpNull,
  dumpString,
  dumpSymbol,
  dumpSymbolLink,
  encodeType: dumpComplex.encodeType,
  load,
  loadArray: loadComplex.loadArray,
  loadFloat,
  loadHash: loadComplex.loadHash,
  loadInt,
  loadIVAR: loadComplex.loadIVAR,
  loadString,
  loadSymbolLink
}
