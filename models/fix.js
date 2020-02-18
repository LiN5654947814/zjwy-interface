'use strict'
module.exports = (sequelize, DataTypes) => {
  const fix = sequelize.define(
    'fix',
    {
      // 报修时间
      fixStartTime: DataTypes.STRING,
      // 报修内容
      fixContent: DataTypes.STRING,
      // 报修业主
      fixOwner: DataTypes.STRING,
      // 报修业主身份证
      fixOwnerCard: DataTypes.STRING,
      // 报修完成时间
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
