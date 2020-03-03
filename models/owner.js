'use strict'
module.exports = (sequelize, DataTypes) => {
  const owner = sequelize.define(
    'owner',
    {
      // 业主身份证
      ownerCard: DataTypes.STRING,
      // 业主手机
      ownerPhone: DataTypes.STRING,
      // 业主名
      ownerName: DataTypes.STRING,
      // 业主性别
      ownerSex: DataTypes.STRING,
      // 业主邮箱
      ownerEmail: DataTypes.STRING,
      // 业主密码
      originalPassword: DataTypes.STRING,
      // 权限
      author: DataTypes.BOOLEAN,
      // 房产登记日
      ownerMoveDate: DataTypes.STRING
    },
    {}
  )
  owner.associate = function(models) {
    models.owner.hasMany(models.estate, {
      foreignKey: 'estateOwnerCard',
      sourceKey: 'ownerCard'
    })
    models.owner.hasMany(models.parking, {
      foreignKey: 'parkingOwnerCard',
      sourceKey: 'ownerCard'
    })
  }
  return owner
}
