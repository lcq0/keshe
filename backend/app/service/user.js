'use strict'

const bcrypt = require('bcryptjs')
const DEBUG = require('debug')
const debug = DEBUG('app:service')

module.exports = db => {
  const MODELS = db
  class Admin {
    async create (user) {
      debug(`create get name: ${user.name} password: ${user.password} checkpass: ${user.checkpass}`)
      if (user.password && user.password !== user.checkpass) {
        throw new Error('密码不一致')
      }
      // delete user.checkpass
      user.password = await createPass(user.password)
      const User = await MODELS.User.create(user)
      debug(`create admin data is : ${JSON.stringify(User)}`)

      if (!User) {
        throw new Error('创建失败，请重试')
      }

      return User.id
    }

    async login (name, password) {
      const user = await MODELS.User.findOne({ name })

      if (!user) {
        throw new Error('登录失败，没有此用户')
      }

      if (await this.comparePass(password, user.password)) {
        return true
      }

      throw new Error('登录失败，密码错误')
    }

    async getCurrent (name, id) {
      let user
      if (name) {
        user = await MODELS.User.findOne({ name, state: 1 }, {
          password: false,
          __v: false
        })
      } else if (id) {
        user = await MODELS.User.findById(id, {
          password: false,
          __v: false
        })
      }
      if (user) {
        return user
      }
      throw new Error('获取用户信息失败')
    }

    comparePass (pass, hash) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(pass, hash, function callback (err, res) {
          if (err) {
            reject(err)
          } else {
            resolve(!!res)
          }
        })
      })
    }
  }
  return new Admin()
}

function createPass (pass) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pass, 10, function callback (err, hash) {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}
