'use strict'
module.exports = (sequelize, DataTypes) => {
  const parking = sequelize.define(
    'parking',
    {
      // 车位编号
      parkingNum: DataTypes.STRING,
      // 车位类型
      parkingType: DataTypes.STRING,
      // 车位租赁开始时间
      parkingStartTime: DataTypes.STRING,
      // 车位租赁结束时间
      parkingEndTime: DataTypes.STRING,
      // 所属业主
      parkingOwner: DataTypes.STRING,
      // 业主身份证
      parkingOwnerCard: DataTypes.STRING
    },
    {}
  )
  parking.associate = function(models) {
    models.parking.hasOne(models.owner, {
      foreignKey: 'ownerCard',
      sourceKey: 'parkingOwnerCard'
    })
  }
  return parking
}
