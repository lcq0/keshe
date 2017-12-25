const config = require('config')
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const schemaConfig = config.get('mongoose.schemaConfig')
const MessageSchemaConfig = require('./schemas/message')
const UserSchema = new Schema(MessageSchemaConfig, schemaConfig)

// 添加插件
UserSchema.plugin(timestamps)
UserSchema.plugin(uniqueValidator)

// 添加静态方法

mongoose.model('Message', MessageSchemaConfig)

module.exports = mongoose.model('Message')
