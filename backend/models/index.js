const _ = require('lodash')
const path = require('path')
const config = require('config')
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const debug = require('debug')('app:mongodb')

mongoose.Promise = require('bluebird')

const db = config.get('mongodb.db')
var connection = mongoose.connect(db, function (err) {
  if (err) {
    debug(`connect to ${db} error: ${err.message}`)
    process.exit(1)
  }
})

autoIncrement.initialize(connection)

if (config.util.getEnv('NODE_ENV') !== 'production') {
  mongoose.set('debug', true)
}

// Load All Models
[
  // Mongoose Models
  'user',
  'message'
].forEach(function (filePath) {
  const modelName = _.capitalize(_.camelCase(filePath))
  exports[modelName] = require(path.join(__dirname, filePath))
})
