'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'estates',
      [
        {
          estateBuilds: 'A栋',
          estateUnit: 'A区',
          estateFloor: '三层',
          estatePlate: '304',
          estateApart: '三房一厅',
          estateArea: '120',
          estateReno: '已装修',
          estateResgister: '已登记',
          estateOwner: '孙笑川',
          estateOwnerCard: '440103199003075954',
          estateContent: '啊啊啊啊',
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerMoveDate: '2020-01-30'
        },
        {
          estateBuilds: 'B栋',
          estateUnit: 'A区',
          estateFloor: '二层',
          estatePlate: '204',
          estateApart: '三房一厅',
          estateArea: '120',
          estateReno: '已装修',
          estateResgister: '未登记',
          estateOwner: '孙亚龙',
          estateOwnerCard: '440103199003077650',
          estateContent: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerMoveDate: '2019-12-01'
        },
        {
          estateBuilds: 'B栋',
          estateUnit: 'A区',
          estateFloor: '二层',
          estatePlate: '102',
          estateApart: '三房一厅',
          estateArea: '120',
          estateReno: '已装修',
          estateResgister: '未登记',
          estateOwner: '',
          estateOwnerCard: '',
          estateContent: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerMoveDate: ''
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('estates', null, {})
  }
}
