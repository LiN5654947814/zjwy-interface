'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pays', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payOwner: {
        type: Sequelize.STRING
      },
      payOwnerPhone: {
        type: Sequelize.STRING
      },
      payOwnerUnit: {
        type: Sequelize.STRING
      },
      payGarbage: {
        type: Sequelize.INTEGER
      },
      payElevator: {
        type: Sequelize.INTEGER
      },
      payLighting: {
        type: Sequelize.INTEGER
      },
      payState: {
        type: Sequelize.STRING
      },
      payDate: {
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
    return queryInterface.dropTable('pays');
  }
};