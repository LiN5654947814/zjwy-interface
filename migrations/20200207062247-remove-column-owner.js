'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('owners', 'ownerMoveDate', {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('owners', 'ownerMoveDate', {})
  }
}
