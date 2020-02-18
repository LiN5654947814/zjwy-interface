'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('complaints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      complaintTime: {
        type: Sequelize.STRING
      },
      complaintType: {
        type: Sequelize.STRING
      },
      complaintContent: {
        type: Sequelize.STRING
      },
      complaintOwner: {
        type: Sequelize.STRING
      },
      complaintOwnerCard: {
        type: Sequelize.STRING
      },
      complainOwnerUnit: {
        type: Sequelize.STRING
      },
      complainReply: {
        type: Sequelize.STRING
      },
      redState: {
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
    return queryInterface.dropTable('complaints');
  }
};