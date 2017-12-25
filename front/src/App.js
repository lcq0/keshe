import React, { Component } from 'react'
import {
  BrowserRouter as Router
} from 'react-router-dom'
import { Layout } from 'antd'

import Header from './components/header/index'
import content from './components/content/index'

// import request from './request'

class App extends Component {
  render () {
    return (
      <Router>
        <Layout>
          <Layout.Header><Header /></Layout.Header>
          <Layout.Content><content.show /></Layout.Content>
        </Layout>
      </Router>
    )
  }
}

export default App
