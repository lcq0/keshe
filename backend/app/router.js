'use strict'

const ROUTER = require('koa-router')
const controllers = require('./controller/v1')
const router = new ROUTER({ prefix: '/api/v1' })

module.exports = router

router.get('/', controllers.home.index)
router.delete('/logout', controllers.user.logout)
router.get('/user/current', controllers.user.current)
router.post('/login', controllers.user.login)
router.post('/register', controllers.user.register)

// message
router.post('/message', controllers.message.create)
router.post('/message/reply', controllers.message.reply)
router.delete('/message', controllers.message.delete)
router.get('/message', controllers.message.get)
