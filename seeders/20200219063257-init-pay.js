'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'pays',
      [
        {
          payOwner: '孙笑川',
          payOwnerPhone: 13224557896,
          payOwnerCard: '440103199003075954',
          payOwnerUnit: 'A栋-A区-101',
          payGarbage: 50,
          payElevator: 50,
          payLighting: 50,
          payApplication: 50,
          payState: '未缴费',
          payDate: '2020-02',
          payCalling: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          payOwner: '孙笑川',
          payOwnerPhone: 13224557896,
          payOwnerCard: '440103199003075954',
          payOwnerUnit: 'A栋-A区-101',
          payGarbage: 50,
          payElevator: 50,
          payLighting: 50,
          payApplication: 50,
          payState: '已缴费',
          payDate: '2020-01',
          payCalling: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('pays', null, {})
  }
}
