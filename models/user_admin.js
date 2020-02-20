'use strict'
module.exports = (sequelize, DataTypes) => {
  const user_admin = sequelize.define(
    'user_admin',
    {
      // 管理员用户名
      username_admin: DataTypes.STRING,
      // 管理员密码
      password_admin: DataTypes.STRING,
      // 权限
      author: DataTypes.BOOLEAN,
      // token
      adminToken: DataTypes.STRING
    },
    {}
  )
  user_admin.associate = function(models) {
    // associations can be defined here
  }
  return user_admin
}
