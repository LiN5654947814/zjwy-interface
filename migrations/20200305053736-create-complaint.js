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
      complaintOwnerPhone: {
        type: Sequelize.STRING
      },
      complaintOwnerUnit: {
        type: Sequelize.STRING
      },
      complaintReply: {
        type: Sequelize.STRING
      },
      readState: {
        type: Sequelize.BOOLEAN
      },
      ownerReadState: {
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
    return queryInterface.dropTable('complaints');
  }
};