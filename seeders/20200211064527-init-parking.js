'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'parkings',
      [
        {
          parkingNum: 'A0001',
          parkingType: '公有',
          parkingStartTime: '',
          parkingEndTime: '',
          parkingOwner: '',
          parkingOwnerCard: '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          parkingNum: 'A0002',
          parkingType: '公有',
          parkingStartTime: '',
          parkingEndTime: '',
          parkingOwner: '',
          parkingOwnerCard: '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          parkingNum: 'A0002',
          parkingType: '公有',
          parkingStartTime: '',
          parkingEndTime: '',
          parkingOwner: '',
          parkingOwnerCard: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('parkings', null, {})
  }
}
