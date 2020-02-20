'use strict'
module.exports = (sequelize, DataTypes) => {
  const owner = sequelize.define(
    'owner',
    {
      // 业主身份证
      ownerCard: DataTypes.STRING,
      // 业主手机号
      ownerPhone: DataTypes.STRING,
      // 业主名
      ownerName: DataTypes.STRING,
      // 业主性别
      ownerSex: DataTypes.STRING,
      // 业主登录邮箱
      ownerEmail: DataTypes.STRING,
      // 业主登录密码
      originalPassword: DataTypes.STRING,
      // 权限
      author: DataTypes.BOOLEAN
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
    models.owner.hasMany(models.complaint, {
      foreignKey: 'complaintOwnerCard',
      sourceKey: 'ownerCard'
    })
  }
  return owner
}
