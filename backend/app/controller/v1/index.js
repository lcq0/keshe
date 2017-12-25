const PATH = require('path')
const FS = require('fs')

let controllers = FS.readdirSync(__dirname)
// DB_INSTANCE
const SERVICE_INSTANCE = require('../../service')

controllers
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach(file => {
    const instance = require(PATH.join(__dirname, file))
    file = file.replace('.js', '')
    exports[file] = instance(SERVICE_INSTANCE)
  })
