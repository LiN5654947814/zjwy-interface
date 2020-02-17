'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fixes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 报修提交时间
      fixStartTime: {
        type: Sequelize.STRING
      },
      // 报修内容
      fixContent: {
        type: Sequelize.STRING
      },
      // 报修业主
      fixOwner: {
        type: Sequelize.STRING
      },
      // 业主身份证
      fixOwnerCard: {
        type: Sequelize.STRING
      },
      // 完成时间
      fixEndTime: {
        type: Sequelize.STRING
      },
      // 报修状态
      fixState: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fixes')
  }
}
