import React from 'react'
import { Card, Button, Modal, Input, message } from 'antd'
import request from '../../request'
import { types } from 'mobx-state-tree'

import components from '../components'

const confirm = Modal.confirm
const { TextArea } = Input

const AddMessage = types.model('message', {
  message: types.string
}).actions(self => ({
  change (e) {
    console.log(e.target.value)
    self.message = e.target.value || self.message
  }
})).views(self => components({
  show () {
    return (
      <TextArea onChange={self.change} data={self.message} autosize={{ minRows: 2, maxRows: 6 }} />
    )
  }
}))

const iterm = types.model('content', {
  message: types.string,
  username: types.string,
  id: types.string,
  admin: false,
  belong_message: types.string,
  belong_username: types.string
}).actions(self => ({
  showAddMessage (type = 1, token) {
    const msg = AddMessage.create({message: ''})
    confirm({
      title: `回复: ${self.username}`,
      content: <msg.show />,
      onOk () {
        return self.reply(msg.message).catch(e => { console.log(e) })
      },
      onCancel () {}
    })
  },

  reply (msg) {
    return request.post(`/message/reply?access_token=${window.token}`, {
      belong: self.id,
      message: msg,
      type: 1
    }).then(res => {
      message.success('回复成功')
    })
  },

  del () {
    return request.delete(`/message?id=${self.id}&access_token=${window.token}`).then(res => {
      message.success('删除成功')
      content.get(window.token, window.user)
    })
  }
})).views(self =>
  components({
    show () {
      return (
        <Card
          type='inner'
          title={self.username}
          extra={self.admin ? (
            <div>
              <Button onClick={self.showAddMessage}>回复</Button>
              &nbsp;&nbsp;&nbsp;
              <Button onClick={self.del}>删除</Button>
            </div>
          ) : ''}
        >
          {self.message}
          { self.belong_message ? (
            <Card
              type='inner'
              title={self.belong_username}
            >
              {self.belong_message}
            </Card>
          ) : ''}
        </Card>
      )
    }
  })
)

const Contents = types.model('contents', {
  once: false,
  messages: types.array(iterm)
}).actions(self => ({
  add (msg, type, token) {
    return request.post(`/message?access_token=${token}`, {
      message: msg, type
    }).then(res => {
      if (res.data === 'success') {
        self.get(token, window.user)
      }
    })
  },

  setDate (data = [], user) {
    self.once = true
    if (data.success && data.success === false) {
      data = []
    }
    self.messages = (data || []).map(d => {
      console.log(d)
      return {
        message: d.message || '',
        username: d.type === 1 ? d.userId.name : '匿名用户',
        id: d._id,
        admin: user.type === 2,
        belong_message: (d.belong && d.belong.message) || '',
        belong_username: (d.belong && d.belong.userId && d.belong.userId.name) || ''
      }
    })
  },

  get (token, user) {
    request.get(`/message?access_token=${token}`).then(res => {
      console.log(res.data)
      if (Array.isArray(res.data)) {
        self.setDate(res.data, user)
      }
    })
  },
  showAddMessage (type = 1, token) {
    return () => {
      const msg = AddMessage.create({message: ''})
      confirm({
        title: '添加留言板',
        content: <msg.show />,
        onOk () {
          return self.add(msg.message, type, token).catch(e => { console.log(e) })
        },
        onCancel () {}
      })
    }
  }
})).views(self =>
  components({
    show () {
      let user = window.user = window.localStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
      } else {
        user = {}
      }

      window.user = user
      const token = window.token = window.localStorage.getItem('token')
      if (!self.once) {
        self.get(token, user)
      }
      return (
        <Card title='留言板' extra={user && user.type === 2 ? (
          ''
        ) : (
          <div>
            <Button type='primary' onClick={self.showAddMessage(1, token)}>留言</Button>
            &nbsp;&nbsp;
            <Button type='primary' onClick={self.showAddMessage(2, token)}>匿名留言</Button>
          </div>
        )}>
          {
            self.messages.map(m => {
              const t = iterm.create({
                message: m.message,
                username: m.username,
                id: m.id,
                admin: m.admin,
                belong_message: m.belong_message,
                belong_username: m.belong_username
              })
              return <t.show />
            })
          }
        </Card>
      )
    }
  })
)

const content = Contents.create({ messages: [] })

export default content
