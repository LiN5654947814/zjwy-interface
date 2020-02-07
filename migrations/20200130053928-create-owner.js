'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('owners', {
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
        ownerUnit: {
          type: Sequelize.STRING
        },
        ownerParking: {
          type: Sequelize.STRING
        },
        ownerEstate: {
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
      .then(() => {
        queryInterface.addIndex('owners', ['ownerCard'], ['ownerPhone'], {
          unique: true
        })
        queryInterface.addColumn('post', 'ownerState', {
          type: STRING
        })
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('owners')
  }
}
