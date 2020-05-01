const fs = require('fs')
const tokens = require('./tokens')

const lines = []

const section = (title, set, fn) => {
  lines.push(`// ${title}`)
  const keys = Object.keys(set)
  keys.forEach(fn)
  lines.push('')
}

lines.push('// DO NOT UPDATE THIS FILE DIRECTLY')
lines.push('// This file is created by a script, using values from tokens.json.')
lines.push('// tokens.json is the \'source of truth\' for the values of these')
lines.push('// variables. From there, they are propagated to this file, but many')
lines.push('// other potential endpoints as well. If you want to change one of')
lines.push('// these values, update tokens.json, not this file directly.')
lines.push('')

section('Colors', tokens.colors.palette, key => {
  lines.push('')
  lines.push(`$${key}: ${tokens.colors.palette[key].hex};`)
  lines.push(`$${key}16: rgba($${key}, 1/6);`)
  lines.push(`$${key}13: rgba($${key}, 1/3);`)
  lines.push(`$${key}23: rgba($${key}, 2/3);`)
})

section('Non-palette colors', tokens.colors.special, key => {
  lines.push(`$${key}: ${tokens.colors.special[key]};`)
})

let base = undefined
section('Resource locations', tokens.resources, dir => {
  if (base) {
    lines.push(`$${dir}: $base+"${tokens.resources[dir]}";`)
  } else {
    lines.push(`$${dir}: "${tokens.resources[dir]}";`)
  }
  if (dir === 'base' && !base) base = tokens.resources[dir]
})

fs.writeFile('./scss/modules/_variables.scss', lines.join('\n'), err => {
  if (err) console.error(err)
})