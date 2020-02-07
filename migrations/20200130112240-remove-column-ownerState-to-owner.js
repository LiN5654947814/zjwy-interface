'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('owners', 'ownerState', {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('owners', 'ownerState', {})
  }
}
