'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'owners',
      [
        {
          ownerCard: '',
          ownerPhone: '',
          ownerName: '',
          ownerSex: '',
          ownerEmail: 'admin',
          originalPassword: 'admin',
          author: true,
          ownerMoveDate: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('owners', null, {})
  }
}
