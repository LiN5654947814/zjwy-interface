'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      messageTitle: {
        type: Sequelize.STRING
      },
      messageContent: {
        type: Sequelize.STRING
      },
      messageOwner: {
        type: Sequelize.STRING
      },
      messageOwnerCard: {
        type: Sequelize.STRING
      },
      messageReadState: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('messages');
  }
};