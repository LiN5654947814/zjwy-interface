'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('estates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      estateBuilds: {
        type: Sequelize.STRING
      },
      estateUnit: {
        type: Sequelize.STRING
      },
      estateFloor: {
        type: Sequelize.STRING
      },
      estatePlate: {
        type: Sequelize.STRING
      },
      estateApart: {
        type: Sequelize.STRING
      },
      estateArea: {
        type: Sequelize.STRING
      },
      estateReno: {
        type: Sequelize.STRING
      },
      estateResgister: {
        type: Sequelize.STRING
      },
      estateOwner: {
        type: Sequelize.STRING
      },
      estateOwnerCard: {
        type: Sequelize.STRING
      },
      estateContent: {
        type: Sequelize.STRING
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
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('estates')
  }
}
