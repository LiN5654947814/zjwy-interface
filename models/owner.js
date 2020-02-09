'use strict'
module.exports = (sequelize, DataTypes) => {
  const owner = sequelize.define(
    'owner',
    {
      // 身份证
      ownerCard: DataTypes.STRING,
      // 联系电话
      ownerPhone: DataTypes.STRING,
      // 业主名称
      ownerName: DataTypes.STRING,
      // 业主性别
      ownerSex: DataTypes.STRING,
      // 业主邮箱
      ownerEmail: DataTypes.STRING,
      // 拥有车位数
      ownerParking: DataTypes.STRING,
      // 拥有房产数
      ownerEstate: DataTypes.STRING,
      // 初始密码
      originalPassword: DataTypes.STRING
    },
    {}
  )
  owner.associate = function(models) {
    models.owner.hasMany(models.estate, {
      foreignKey: 'estateOwnerCard',
      sourceKey: 'ownerCard'
    })
  }
  return owner
}
