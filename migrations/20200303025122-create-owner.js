'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('owners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerCard: {
        type: Sequelize.STRING
      },
      ownerPhone: {
        type: Sequelize.STRING
      },
      ownerName: {
        type: Sequelize.STRING
      },
      ownerSex: {
        type: Sequelize.STRING
      },
      ownerEmail: {
        type: Sequelize.STRING
      },
      originalPassword: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.BOOLEAN
      },
      ownerMoveDate: {
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
    return queryInterface.dropTable('owners');
  }
};