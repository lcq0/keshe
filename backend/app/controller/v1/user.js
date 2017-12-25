'use strict'

const jwt = require('jwt-simple')
const config = require('config')
const moment = require('moment')
const DEBUG = require('debug')
const debug = DEBUG('app:controller:v1')

module.exports = service => {
  class AdminController {
    async login () {
      const { name = '', password = '' } = this.request.body

      this.assert(name, 400, 'The account is must')
      this.assert(password, 400, 'The password is must')

      await service.user.login(name, password)
      const user = await service.user.getCurrent(name)
      debug('set session -> ', user)

      const payload = {
        userId: user._id,
        exp: moment().add(7, 'days')
      }
      const token = jwt.encode(payload, config.jwt.secret)
      this.status = 200
      this.body = token
    }

    // 登出
    async logout () {
      if (!this.session.user) {
        this.throw(500, '你还未登陆')
      }
      this.session = null
      this.status = 200
      this.body = true
    }

    async current () {
      debug('get current user data -> ', this.request.session)
      if (!this.request.session.userId) {
        this.throw(500, '你还未登陆')
      }

      this.body = await service.user.getCurrent(null, this.request.session.userId)
    }

    // 注册
    async register () {
      const { name = '', password = '', checkpass = '' } = this.request.body

      this.assert(name, 400, 'The account is must')
      this.assert(password, 400, 'The password is must')
      this.assert(checkpass, 400, 'The checkpass is must')

      const userId = await service.user.create(this.request.body)
      debug(`create new User which ID is ${userId}`)

      this.status = 201
      this.body = true
    }
  }
  return new AdminController()
}
