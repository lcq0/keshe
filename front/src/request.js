import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:2991/api/v1',
  timeout: 1000
})
