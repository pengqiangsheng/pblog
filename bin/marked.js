#!/usr/bin/env node

const { resolve } = require('path')

const command = [...process.argv].pop()

process.env.DEBUG = 'pblog'

if(command === '-debug') {
  process.env.DEBUG = 'pblog'
}else if(command === '-s') {
  require(resolve(__dirname, '../index.js'))(process.env.PWD, true)
}else {
  require(resolve(__dirname, '../index.js'))(process.env.PWD, false)
}

