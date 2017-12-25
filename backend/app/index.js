'use strict'

const KOA = require('koa')
const moment = require('moment')
const http = require('http')
const jwt = require('jwt-simple')
// const fs = require('fs')
const CORS = require('kcors')
const bearerToken = require('koa-bearer-token')
const BODY_PARSER = require('koa-bodyparser')
const LOGGER = require('koa-logger')
const RESPONSE_TIME = require('koa-response-time')
const DEBUG = require('debug')

const config = require('config')
const debug = DEBUG('app:start')

// CONTROLLERS instance
const route = require('./router')

// ENVIRONMENT VARIABLES
const SECRET = process.env.SECRET || 'xiafeng37513'

const port = process.env.HTTPPORT || 2991

// APP
const APP = new KOA()

APP.proxy = true

APP.use(RESPONSE_TIME())
APP.use(LOGGER())

APP.keys = [SECRET]
APP.use(CORS({
  credentials: true,
  keepHeadersOnError: true,
  origin: '*'
}))
// BODY PARSER
APP.use(BODY_PARSER({
  onerror: (err, ctx) => {
    if (err) {
      ctx.throw('Error parsing the body information', 422)
    }
  }
}))
APP.use(bearerToken({
  bodyKey: 'access_token',
  queryKey: 'access_token',
  headerKey: 'AccessToken'
}))
APP.use(function * (next, ctx) {
  try {
    yield next
  } catch (e) {
    console.log(e)
    this.status = 200
    this.body = {
      success: false,
      message: `${e}`
    }
  }
})
APP.use(function * (next) {
  if (this.request.token) {
    this.request.session = jwt.decode(this.request.token, config.jwt.secret)
    if (this.request.session && this.request.session.exp) {
      if (moment(this.request.session.exp).diff(moment()) < 0) {
        throw new Error('您的token已经过期，请重新登录')
      }
    }
  } else {
    this.request.session = {}
  }
  yield next
})
APP.use(route.routes())
APP.use(route.allowedMethods())

http.createServer(APP.callback()).listen(port)

module.exports = APP

debug('Server listening on port: ', port)
