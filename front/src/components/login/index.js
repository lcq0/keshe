import React from 'react'
import { Modal, Form, Icon, Input, message } from 'antd'
import request from '../../request'
import { types } from 'mobx-state-tree'

import components from '../components'

const FormItem = Form.Item

const Login = types.model('login', {
  name: types.string,
  password: types.string
}).actions(self => ({
  handleChange (e) {
    self[e.target.id] = e.target.value
  },
  getCurrent () {
    const token = window.localStorage.getItem('token')
    return request.get(`/user/current?access_token=${token}`).then(res => {
      if (res.data._id) {
        window.localStorage.setItem('user', JSON.stringify(res.data))
      } else {
        message.error('登陆失败 ' + (res.data.message || '未知错误'))
      }
    })
  },
  login () {
    request.post('/login', {
      name: self.name,
      password: self.password
    }).then((d) => {
      console.log(d.data)
      if (typeof d.data === 'string') {
        message.success('登陆成功, 跳转到首页')
        window.localStorage.setItem('token', d.data)
        self.getCurrent().then(() => {
          window.location = '/'
        })
      } else {
        message.error('登陆失败 ' + (d.data.message || '未知错误'))
      }
    }).catch(e => {
      message.error('发生了未知的错误')
    })
  }
})).views(self =>
  components({
    show ({ match }) {
      let visible = false
      if (match.path === '/login') {
        visible = true
      }
      console.log(self.name)
      return (
        <Modal
          title='用户登陆'
          visible={visible}
          style={{ top: 20 }}
          onOk={self.login}
        >
          <Form className='login-form'>
            <FormItem>
              <Input id='name' onChange={self.handleChange} value={self.name} prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Username' />
            </FormItem>
            <FormItem>
              <Input id='password' onChange={self.handleChange} value={self.password} prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />
            </FormItem>
          </Form>
        </Modal>
      )
    }
  })
)

const login = Login.create({
  name: '',
  password: '',
  visible: false
})

export default login
