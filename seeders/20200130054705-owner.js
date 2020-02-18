'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'owners',
      [
        {
          ownerCard: '440103199003075954',
          ownerPhone: '13224557896',
          ownerName: '孙笑川',
          ownerSex: '男',
          ownerEmail: '123@qq.com',
          ownerUnit: 'A栋-A区-304',
          ownerParking: '1',
          ownerEstate: '1',
          ownerMoveDate: '2020-1-30',
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
