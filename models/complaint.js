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
      // 业主联系电话
      complaintOwnerPhone: DataTypes.STRING,
      // 业主所在单位
      complaintOwnerUnit: DataTypes.STRING,
      // 回复
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
