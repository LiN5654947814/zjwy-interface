'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'notices',
      [
        {
          noticeTitle: '缴费公告',
          noticeContent:
            '请当月未缴费的业主尽快到小区物业管理处缴费，如果您的物业服务费不能按时缴纳，将直接影响物业服务工作的正常开展，也是对已经缴纳物业费业主的利益侵犯。为维护广大业主利益，创建和谐、温馨、美丽的家园，请各位业主按时缴费，谢谢！',
          noticeTime: '2020-02-22',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notices', null, {})
  }
}
