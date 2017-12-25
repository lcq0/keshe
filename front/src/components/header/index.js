import React, { Component } from 'react'
import { Layout, Menu, Button, Dropdown, Icon, message } from 'antd'
import { Link, Route } from 'react-router-dom'
import login from '../login/index'
import register from '../register/index'

import './index.css'

const { Header } = Layout

class header extends Component {
  constructor () {
    super()
    this.state = {
      _id: '',
      name: '',
      state: '',
      type: ''
    }
  }
  componentDidMount () {
    let user = window.localStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      this.setState(user)
    }
  }

  logout () {
    window.localStorage.clear()
    this.setState({
      _id: '',
      name: '',
      state: '',
      type: ''
    })
    message.success('登出成功')
  }
  render () {
    const menu = (
      <Menu>
        <Menu.Item>
          <Button onClick={this.logout.bind(this)}>退出</Button>
        </Menu.Item>
      </Menu>
    )
    return (
      <Header style={{ position: 'fixed', width: '100%' }}>
        <Menu
          theme='dark'
          mode='horizontal'
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px', textAlign: 'center' }}
        >
          <Menu.Item key='1'>首页</Menu.Item>
          <Menu.Item key='2'>nav 2</Menu.Item>
          <Menu.Item key='3'>nav 3</Menu.Item>
          {this.state._id ? (
            <Dropdown overlay={menu} className='floatRight'>
              <a className='ant-dropdown-link floatRight' href='javascript:void 0'>
                {this.state.name} <Icon type='down' />
              </a>
            </Dropdown>
          ) : (
            <div>
              <Link to='/login'>
                <Button
                  style={{ marginTop: '16px', float: 'right' }}
                >登陆</Button>
              </Link>
              <Link to='/register'>
                <Button style={{ marginTop: '16px', float: 'right' }}>注册</Button>
              </Link>
              <Route path='/register' component={register.show} />
              <Route path='/login' component={login.show} />
            </div>
          )}
        </Menu>
      </Header>
    )
  }
}

export default header
