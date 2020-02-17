'use strict'
module.exports = (sequelize, DataTypes) => {
  const fix = sequelize.define(
    'fix',
    {
      fixStartTime: DataTypes.STRING,
      fixContent: DataTypes.STRING,
      fixOwner: DataTypes.STRING,
      fixOwnerCard: DataTypes.STRING,
      fixEndTime: DataTypes.STRING,
      fixState: DataTypes.STRING
    },
    {}
  )
  fix.associate = function(models) {
    // associations can be defined here
  }
  return fix
}
