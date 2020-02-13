'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('parkings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parkingNum: {
        type: Sequelize.STRING
      },
      parkingType: {
        type: Sequelize.STRING
      },
      parkingStartTime: {
        type: Sequelize.STRING
      },
      parkingEndTime: {
        type: Sequelize.STRING
      },
      parkingOwner: {
        type: Sequelize.STRING
      },
      parkingOwnerCard: {
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
    return queryInterface.dropTable('parkings');
  }
};