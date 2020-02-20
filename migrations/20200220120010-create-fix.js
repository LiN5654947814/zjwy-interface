'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fixes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fixStartTime: {
        type: Sequelize.STRING
      },
      fixContent: {
        type: Sequelize.STRING
      },
      fixOwnerUnit: {
        type: Sequelize.STRING
      },
      fixOwner: {
        type: Sequelize.STRING
      },
      fixOwnerPhone: {
        type: Sequelize.STRING
      },
      fixEndTime: {
        type: Sequelize.STRING
      },
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fixes');
  }
};