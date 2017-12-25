// const ObjectId = require('mongoose').Schema.Types.ObjectId

// 0: 未启用，1: 正在使用中，2: 禁止使用
const stateEnum = {
  values: [ 0, 1, 2 ],
  message: '`{PATH}` does not support value `{VALUE}`'
}

// 1: 用户，2: 管理员
const typeeEnum = {
  values: [ 1, 2 ],
  message: '`{PATH}` does not support value `{VALUE}`'
}

module.exports = {
  // 用户账户
  name: { type: String, index: true, required: '用户账户不能为空', unique: '账户名已被使用' },
  // 身份
  type: { type: Number, index: true, default: 1, enum: typeeEnum },
  state: { type: Number, default: 1, index: true, enum: stateEnum },
  // 密码
  password: { type: 'String' }
}
