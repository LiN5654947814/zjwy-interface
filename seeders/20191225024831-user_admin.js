'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'user_admins',
      [
        {
          username_admin: 'admin',
          password_admin: 'admin',
          author: true,
          adminToken: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_admins', null, {})
  }
}
