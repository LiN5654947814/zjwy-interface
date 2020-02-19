'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'complaints',
      [
        {
          complaintTime: '2020-02-18',
          complaintType: '维修投诉',
          complaintContent: '围栏损坏',
          complaintOwner: '孙笑川',
          complaintOwnerCard: '440103199003075954',
          complainOwnerUnit: 'A栋-B区-101',
          complainReply: '',
          redState: '0',
          ownerRedState: '0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          complaintTime: '2020-02-18',
          complaintType: '扰民投诉',
          complaintContent: '隔壁吼太大声',
          complaintOwner: '孙亚龙',
          complaintOwnerCard: '440103199003075954',
          complainOwnerUnit: 'B栋-A区-204',
          complainReply: '',
          redState: '0',
          ownerRedState: '0',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          complaintTime: '2020-02-18',
          complaintType: '安全投诉',
          complaintContent: '摄像头损坏',
          complaintOwner: '孙笑川',
          complaintOwnerCard: '440103199003075954',
          complainOwnerUnit: 'A栋-B区-101',
          complainReply: '',
          redState: '0',
          ownerRedState: '0',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('complaints', null, {})
  }
}
