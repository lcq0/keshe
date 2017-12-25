'use strict'

// const DEBUG = require('debug')
// const debug = DEBUG('app:controller:v1')

module.exports = service => {
  class MessageController {
    async create () {
      if (!this.request.session.userId) {
        throw new Error('请登录')
      }

      const { message, type } = this.request.body

      this.assert(message, 400, 'message can not be empty')

      await service.message.create(this.request.session.userId, message, type)
      this.body = 'success'
    }

    async reply () {
      if (!this.request.session.userId) {
        throw new Error('请登录')
      }

      const { belong, message, type } = this.request.body
      await service.message.reply(this.request.session.userId, belong, message, type)
      this.body = 'success'
    }

    async delete () {
      if (!this.request.session.userId) {
        throw new Error('请登录')
      }

      const { id } = this.request.query

      if (!id) {
        throw new Error('参数不能为空')
      }

      await service.message.delete(id)

      this.body = 'success'
    }

    async get () {
      const data = await service.message.get(this.request.session.userId)
      this.body = data
    }
  }
  return new MessageController()
}
