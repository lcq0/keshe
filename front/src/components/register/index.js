import React from 'react'
import { Modal, Form, Icon, Input, message } from 'antd'
import request from '../../request'
import { types } from 'mobx-state-tree'

import components from '../components'

const FormItem = Form.Item

const Register = types.model('login', {
  name: types.string,
  password: types.string,
  checkpass: types.string
}).actions(self => ({
  handleChange (e) {
    self[e.target.id] = e.target.value
  },
  register () {
    message.info('注册中')
    request.post('/register', {
      name: self.name,
      password: self.password,
      checkpass: self.checkpass
    }).then((res = {}) => {
      console.log(res.data)
      if (res.data === true || (res.data && res.data.success)) {
        message.success('注册成功，跳转到登陆')
        window.location = '/login'
      } else {
        message.error(`注册失败，${(res.data && res.data.message) || '未知错误'}`)
      }
    }).catch(e => {
      message.error(`${e}`)
    })
  }
})).views(self =>
  components({
    show ({ match }) {
      let visible = false
      if (match.path === '/register') {
        visible = true
      }

      return (
        <Modal
          title='用户注册'
          visible={visible}
          style={{ top: 20 }}
          onOk={self.register}
        >
          <Form className='login-form'>
            <FormItem>
              <Input id='name' onChange={self.handleChange} value={self.name} prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Username' />
            </FormItem>
            <FormItem>
              <Input id='password' onChange={self.handleChange} value={self.password} prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />
            </FormItem>
            <FormItem>
              <Input id='checkpass' onChange={self.handleChange} value={self.checkpass} prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />
            </FormItem>
          </Form>
        </Modal>
      )
    }
  })
)

const register = Register.create({
  name: '',
  password: '',
  checkpass: ''
})

export default register
