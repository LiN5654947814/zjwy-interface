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
          originalPassword: '123456',
          ownerMoveDate: '',
          author: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ownerCard: '440103199003077650',
          ownerPhone: '13445774896',
          ownerName: '孙亚龙',
          ownerSex: '男',
          ownerEmail: '77@qq.com',
          originalPassword: '123456',
          ownerMoveDate: '',
          author: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          ownerCard: '440103199003072155',
          ownerPhone: '13547846152',
          ownerName: '梁志斌',
          ownerSex: '男',
          ownerEmail: 'acf@qq.com',
          originalPassword: '123456',
          ownerMoveDate: '',
          author: false,
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
