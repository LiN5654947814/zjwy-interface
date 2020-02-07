'use strict'
module.exports = {
  // up是建表
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 管理员登录名
      username_admin: {
        type: Sequelize.STRING
      },
      // 管理员登录密码
      password_admin: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  // down是删除表
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_admins')
  }
}
