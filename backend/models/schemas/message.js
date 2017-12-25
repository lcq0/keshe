const ObjectId = require('mongoose').Schema.Types.ObjectId

// 0: 待审核，1: 通过审核，-1: 已删除
const stateEnum = {
  values: [ 0, 1, -1 ],
  message: '`{PATH}` does not support value `{VALUE}`'
}

// 1: 实名留言， 2: 匿名留言
const typeEnum = {
  values: [1, 2],
  message: '`{PATH}` does not support value `{VALUE}`'
}

module.exports = {
  // 用户账户
  userId: { type: ObjectId, index: true, required: '留言用户不能为空', ref: 'User' },
  // 状态
  state: { type: Number, default: 0, index: true, enum: stateEnum },
  // 类型
  type: { type: Number, default: 1, index: true, enum: typeEnum },
  // 内容
  message: { type: 'String' },
  // 所属上级留言
  belong: { type: ObjectId, ref: 'Message' }
}
