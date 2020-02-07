'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'estates',
      [
        {
          estateBuilds: 'A栋',
          estateUnit: 'A区',
          estateFloor: '二层',
          estatePlate: '202',
          estateApart: '三房一厅',
          estateArea: '120',
          estateReno: '已装修',
          estateResgister: '已登记',
          estateOwner: '孙笑川',
          estateOwnerCard: '440103199003075954',
          estateContent: '啊啊啊啊',
          createdAt: new Date(),
          updatedAt: new Date()
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
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('estates', null, {})
  }
}
