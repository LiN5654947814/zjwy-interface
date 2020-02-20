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
