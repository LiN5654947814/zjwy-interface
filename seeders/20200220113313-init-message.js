'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'messages',
      [
        {
          messageTitle: '缴费通知',
          messageContent: '请尽快到物业中心处缴清当月的物业管理费，谢谢合作',
          messageOwner: '孙笑川',
          messageOwnerCard: '440103199003075954',
          messageReadState: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('messages', null, {})
  }
}
