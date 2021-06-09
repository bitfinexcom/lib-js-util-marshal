'use strict'

const { exec } = require('child_process')

const hasRuby = () => new Promise((resolve) => exec('ruby -v', (err, stdout, stderr) => {
  if (err) return resolve(false)
  if (stderr) return resolve(false)

  resolve(stdout.trim().startsWith('ruby'))
}))

const dumpRuby = (str) => {
  const cmd = `ruby -e 'puts Marshal.dump(${str}).unpack("H*")[0]'`

  return new Promise((resolve, reject) => exec(cmd, (err, stdout, stderr) => {
    if (err) return reject(err)
    if (stderr) return reject(new Error(stderr))

    resolve(Buffer.from(stdout.trim(), 'hex'))
  }))
}

const loadRuby = (buff) => {
  const hex = buff.toString('hex')
  const cmd = `ruby -e 'p Marshal.load(["${hex}"].pack("H*"))'`

  return new Promise((resolve, reject) => exec(cmd, (err, stdout, stderr) => {
    if (err) return reject(err)
    if (stderr) return reject(new Error(stderr))

    resolve(stdout.trim())
  }))
}

module.exports = {
  hasRuby,
  dumpRuby,
  loadRuby
}
