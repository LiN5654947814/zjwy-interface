'use strict'
module.exports = (sequelize, DataTypes) => {
  const user_admin = sequelize.define(
    'user_admin',
    {
      username_admin: DataTypes.STRING,
      password_admin: DataTypes.STRING
    },
    {}
  )
  user_admin.associate = function(models) {
    // associations can be defined here
  }
  return user_admin
}
