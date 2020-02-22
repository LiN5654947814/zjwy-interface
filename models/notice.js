'use strict'
module.exports = (sequelize, DataTypes) => {
  const notice = sequelize.define(
    'notice',
    {
      // 公告标题
      noticeTitle: DataTypes.STRING,
      // 公告内容
      noticeContent: DataTypes.STRING,
      // 公告时间
      noticeTime: DataTypes.STRING
    },
    {}
  )
  notice.associate = function(models) {
    // associations can be defined here
  }
  return notice
}
