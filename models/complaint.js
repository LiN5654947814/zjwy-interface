'use strict'
module.exports = (sequelize, DataTypes) => {
  const complaint = sequelize.define(
    'complaint',
    {
      // 投诉时间
      complaintTime: DataTypes.STRING,
      // 投诉类型
      complaintType: DataTypes.STRING,
      // 投诉内容
      complaintContent: DataTypes.STRING,
      // 投诉业主
      complaintOwner: DataTypes.STRING,
      // 投诉身份证
      complaintOwnerCard: DataTypes.STRING,
      // 所在单元
      complainOwnerUnit: DataTypes.STRING,
      // 回复信息
      complainReply: DataTypes.STRING,
      // 查看状态
      redState: DataTypes.STRING
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
