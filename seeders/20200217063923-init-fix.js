'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'fixes',
      [
        {
          fixStartTime: '2020-02-17',
          fixContent: '厕所拥堵',
          fixOwner: '孙笑川',
          fixOwnerCard: '440103199003075954',
          fixEndTime: '2020-02-17',
          fixState: '已完成',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          fixStartTime: '2020-02-17',
          fixContent: '厕所拥堵',
          fixOwner: '孙亚龙',
          fixOwnerCard: '440103199003077650',
          fixEndTime: '',
          fixState: '未完成',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('fixes', null, {})
  }
}
