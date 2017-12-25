'use strict'

const DEBUG = require('debug')
const debug = DEBUG('app:service')

module.exports = db => {
  const MODELS = db
  class Admin {
    // 创建留言
    async create (userId, message, type = 1) {
      debug(`create message userId: ${userId} message: ${message} type: ${type}`)
      if (!userId && !message) {
        throw new Error('内容不能为空')
      }

      const Message = await MODELS.Message.create({ userId, message, type })
      debug(`create message return data is : ${JSON.stringify(Message)}`)

      if (!Message || !Message.id) {
        throw new Error('创建失败，请重试')
      }

      return Message.id
    }

    //  回复留言
    async reply (userId, belong, message, type = 1) {
      if (!userId && !message) {
        throw new Error('内容不能为空')
      }

      const msg = await MODELS.Message.findOne({ _id: belong })

      if (msg.state !== 1) {
        await msg.update({ state: 1 })
      }

      if (!msg.id) {
        throw new Error('回复失败，留言不存在')
      }

      const Message = await MODELS.Message.create({ userId, message, type, belong })
      debug(`create message return data is : ${JSON.stringify(Message)}`)

      if (!Message || !Message.id) {
        throw new Error('创建失败，请重试')
      }

      return Message.id
    }

    async delete (id) {
      const msg = await MODELS.Message.update({ _id: id }, { state: -1 })
      debug(`delete message return data is : ${JSON.stringify(msg)}`)

      return msg.id
    }

    async get (userId) {
      const user = await MODELS.User.findById(userId)
      const state = user.type === 2 ? [0, 1] : [1]
      let data = await MODELS.Message.find({
        belong: { $exists: false },
        state
      }, null, { skip: 0 }).populate('userId', 'name')
      for (let i = 0, l = data.length || 0; i < l; i++) {
        data[i].belong = await MODELS.Message.findOne({ belong: data[i]._id }, 'message userId').populate('userId', 'name')
      }
      return data
    }
  }
  return new Admin()
}
