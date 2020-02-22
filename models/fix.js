'use strict'
module.exports = (sequelize, DataTypes) => {
  const fix = sequelize.define(
    'fix',
    {
      // 报修时间
      fixStartTime: DataTypes.STRING,
      // 报修内容
      fixContent: DataTypes.STRING,
      // 业主所在单元
      fixOwnerUnit: DataTypes.STRING,
      // 业主
      fixOwner: DataTypes.STRING,
      // 业主身份证
      fixOwnerCard: DataTypes.STRING,
      // 联系电话
      fixOwnerPhone: DataTypes.STRING,
      // 完成时间
      fixEndTime: DataTypes.STRING,
      // 完成状态
      fixState: DataTypes.STRING
    },
    {}
  )
  fix.associate = function(models) {
    // associations can be defined here
  }
  return fix
}
