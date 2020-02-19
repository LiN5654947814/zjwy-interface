'use strict'
module.exports = (sequelize, DataTypes) => {
  const complaint = sequelize.define(
    'complaint',
    {
      // 投诉日期
      complaintTime: DataTypes.STRING,
      // 投诉类型
      complaintType: DataTypes.STRING,
      // 投诉内容
      complaintContent: DataTypes.STRING,
      // 投诉业主
      complaintOwner: DataTypes.STRING,
      // 业主身份证
      complaintOwnerCard: DataTypes.STRING,
      // 业主所在单元
      complainOwnerUnit: DataTypes.STRING,
      // 物业回复
      complainReply: DataTypes.STRING,
      // 消息读取状态
      redState: DataTypes.STRING,
      // 业主消息读取状态
      ownerRedState: DataTypes.STRING
    },
    {}
  )
  complaint.associate = function(models) {
    models.complaint.hasOne(models.estate, {
      foreignKey: 'estateOwnerCard',
      sourceKey: 'complaintOwnerCard'
    })
  }
  return complaint
}
