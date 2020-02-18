'use strict'
module.exports = (sequelize, DataTypes) => {
  const estate = sequelize.define(
    'estate',
    {
      // 楼层
      estateBuilds: DataTypes.STRING,
      // 单元
      estateUnit: DataTypes.STRING,
      // 楼层
      estateFloor: DataTypes.STRING,
      // 门牌
      estatePlate: DataTypes.STRING,
      // 户型
      estateApart: DataTypes.STRING,
      // 面积
      estateArea: DataTypes.STRING,
      // 装修
      estateReno: DataTypes.STRING,
      // 登记状态
      estateResgister: DataTypes.STRING,
      // 绑定业主名
      estateOwner: DataTypes.STRING,
      // 绑定业主身份证
      estateOwnerCard: DataTypes.STRING,
      // 备注
      estateContent: DataTypes.STRING,
      // 迁入时间
      ownerMoveDate: DataTypes.STRING
    },
    {}
  )
  estate.associate = function(models) {
    models.estate.hasOne(models.owner, {
      foreignKey: 'ownerCard',
      sourceKey: 'estateOwnerCard'
    })
    models.estate.hasMany(models.complaint, {
      foreignKey: 'complaintOwnerCard',
      sourceKey: 'estateOwnerCard'
    })
  }
  return estate
}
