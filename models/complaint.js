'use strict'
module.exports = (sequelize, DataTypes) => {
  const complaint = sequelize.define(
    'complaint',
    {
      // 投诉提交时间
      complaintTime: DataTypes.STRING,
      // 投诉类型
      complaintType: DataTypes.STRING,
      // 投诉内容
      complaintContent: DataTypes.STRING,
      // 投诉业主
      complaintOwner: DataTypes.STRING,
      // 投诉业主手机
      complaintOwnerPhone: DataTypes.STRING,
      // 投诉业主所在单元
      complaintOwnerUnit: DataTypes.STRING,
      // 投诉回复
      complaintReply: DataTypes.STRING,
      // 管理员阅读状态
      readState: DataTypes.BOOLEAN,
      // 业主阅读状态
      ownerReadState: DataTypes.BOOLEAN
    },
    {}
  )
  complaint.associate = function(models) {
    // associations can be defined here
  }
  return complaint
}
