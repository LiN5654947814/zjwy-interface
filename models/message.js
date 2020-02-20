'use strict'
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define(
    'message',
    {
      // 消息标题
      messageTitle: DataTypes.STRING,
      // 消息内容
      messageContent: DataTypes.STRING,
      // 接收业主
      messageOwner: DataTypes.STRING,
      // 接收业主身份证
      messageOwnerCard: DataTypes.STRING,
      // 读取状态
      messageReadState: DataTypes.BOOLEAN
    },
    {}
  )
  message.associate = function(models) {
    // associations can be defined here
  }
  return message
}
