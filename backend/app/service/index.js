const PATH = require('path')
const FS = require('fs')

let services = FS.readdirSync(__dirname)
// DB_INSTANCE
const DB_INSTANCE = require('../../models')

services
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach(file => {
    const instance = require(PATH.join(__dirname, file))
    file = file.replace('.js', '')
    exports[file] = instance(DB_INSTANCE)
  })
