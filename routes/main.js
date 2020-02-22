const express = require('express')
const router = express.Router()
const models = require('../models')
const jwt = require('jsonwebtoken')

// 获取所有公告信息
router.get('/getAllNotice', function(req, res, next) {
  const noticeList = models.notice.findAll().then(noticeList => {
    if (noticeList != null) {
      res.json({ state: 200, noticeList: noticeList })
    } else {
      res.json({ state: 400 })
    }
  })
})

// 编辑公告信息
router.post('/modifyNotice', function(req, res, next) {
  let noticeInfo = req.body.params.noticeInfo
  const notice = models.notice
    .update(noticeInfo, {
      where: {
        id: noticeInfo.id
      }
    })
    .then(notice => {
      if (notice != null) {
        res.json({ state: 200, message: '修改成功' })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 新增公告信息
router.post('/addNotice', function(req, res, next) {
  let addBulletinNotice = req.body.params.addBulletinNotice
  const notice = models.notice.create(addBulletinNotice).then(notice => {
    if (notice != null) {
      res.json({ state: 200, message: '添加成功' })
    } else {
      res.json({ state: 400 })
    }
  })
})

// 根据id获取公告
router.post('/getNoticeById', function(req, res, next) {
  let noticeId = req.body.params.noticeId
  const notice = models.notice
    .findOne({
      where: {
        id: noticeId
      }
    })
    .then(notice => {
      if (notice != null) {
        res.json({ state: 200, notice: notice })
      } else {
        res.json({ state: 400 })
      }
    })
})

module.exports = router
