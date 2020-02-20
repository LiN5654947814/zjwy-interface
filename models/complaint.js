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
      // 业主手机号
      complaintOwnerPhone: DataTypes.STRING,
      // 业主所在单元
      complainOwnerUnit: DataTypes.STRING,
      // 物业回复
      complaintReply: DataTypes.STRING,
      // 物业阅读状态
      readState: DataTypes.BOOLEAN,
      // 业主消息状态
      ownerReadState: DataTypes.BOOLEAN
    },
    {}
  )
  complaint.associate = function(models) {}
  return complaint
}
