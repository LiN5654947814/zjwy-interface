'use strict'
module.exports = (sequelize, DataTypes) => {
  const pay = sequelize.define(
    'pay',
    {
      // 缴费业主
      payOwner: DataTypes.STRING,
      // 业主手机
      payOwnerPhone: DataTypes.STRING,
      // 业主所在单元
      payOwnerUnit: DataTypes.STRING,
      // 垃圾费
      payGarbage: DataTypes.INTEGER,
      // 电梯费
      payElevator: DataTypes.INTEGER,
      // 公摊照明费
      payLighting: DataTypes.INTEGER,
      // 缴费状态
      payState: DataTypes.STRING,
      // 应缴月
      payDate: DataTypes.STRING
    },
    {}
  )
  pay.associate = function(models) {
    // associations can be defined here
  }
  return pay
}
