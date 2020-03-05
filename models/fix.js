'use strict'
module.exports = (sequelize, DataTypes) => {
  const fix = sequelize.define(
    'fix',
    {
      // 报修开始日期
      fixStartTime: DataTypes.STRING,
      // 报修内容
      fixContent: DataTypes.STRING,
      // 报修业主所在单元
      fixOwnerUnit: DataTypes.STRING,
      // 业主
      fixOwner: DataTypes.STRING,
      // 业主联系电话
      fixOwnerPhone: DataTypes.STRING,
      // 完成日期
      fixEndTime: DataTypes.STRING,
      // 报修状态
      fixState: DataTypes.STRING
    },
    {}
  )
  fix.associate = function(models) {
    // associations can be defined here
  }
  return fix
}
