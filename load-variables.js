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

const cornerRatio = Math.round((1 / tokens.corner) * 1000) / 1000
lines.push('// Border radii')
lines.push(`$border-radius-long: 1em unquote("/") ${cornerRatio}em;`)
lines.push(`$border-radius-tall: ${cornerRatio}em unquote("/") 1em;`)
lines.push(`$border-radius-long-double: 2em unquote("/") ${cornerRatio * 2}em;`)
lines.push(`$border-radius-tall-double: ${cornerRatio * 2}em unquote("/") 2em;`)
lines.push(`$border-radius-long-triple: 3em unquote("/") ${cornerRatio * 3}em;`)
lines.push(`$border-radius-tall-triple: ${cornerRatio * 3}em unquote("/") 3em;`)
lines.push('')

section('Breakpoints', tokens.breakpoints, key => {
  lines.push(`$breakpoint-${key}: ${tokens.breakpoints[key]};`)
})

section('Colors', tokens.colors.palette, key => {
  lines.push(`$${key}: ${tokens.colors.palette[key].hex};`)
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
