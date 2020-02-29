'use strict';
module.exports = (sequelize, DataTypes) => {
  const pay = sequelize.define('pay', {
    payOwner: DataTypes.STRING,
    payOwnerPhone: DataTypes.STRING,
    payOwnerCard: DataTypes.STRING,
    payOwnerUnit: DataTypes.STRING,
    payGarbage: DataTypes.INTEGER,
    payElevator: DataTypes.INTEGER,
    payLighting: DataTypes.INTEGER,
    payApplication: DataTypes.INTEGER,
    payState: DataTypes.STRING,
    payDate: DataTypes.STRING,
    payCalling: DataTypes.BOOLEAN
  }, {});
  pay.associate = function(models) {
    // associations can be defined here
  };
  return pay;
};