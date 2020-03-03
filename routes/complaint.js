const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op

// 获取所有投诉信息
router.get('/getAllComplaint', function(req, res, next) {
  const complaintList = models.complaint.findAll().then(complaintList => {
    if (complaintList != null) {
      res.json({ state: 200, complaintList: complaintList })
    } else {
      res.json({ state: 400 })
    }
  })
})
// 按条件搜索
router.post('/searchComplaint', function(req, res, next) {
  const complaintSearch = req.body.params.complaintSearch
  if (!complaintSearch.complaintOwner) {
    complaintSearch.complaintOwner = ''
  }
  if (!complaintSearch.complaintType) {
    complaintSearch.complaintType = ''
  }
  let where = {
    complaintOwner: {
      [Op.like]: '%' + complaintSearch.complaintOwner + '%'
    },
    complaintType: {
      [Op.like]: '%' + complaintSearch.complaintType + '%'
    }
  }
  console.log(complaintSearch)
  const complaintList = models.complaint
    .findAll({
      where: where
    })
    .then(complaint => {
      if (complaint != null) {
        res.json({ state: 200, complaintList: complaint })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 标记已读
router.post('/readStateChange', function(req, res, next) {
  let complaintInfo = req.body.params.complaint
  complaintInfo.readState = '1'
  const complaint = models.complaint
    .update(complaintInfo, {
      where: {
        id: complaintInfo.id
      }
    })
    .then(complaint => {
      if (complaint != null) {
        res.json({ state: 200, message: '标记已读' })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 删除单个投诉信息
router.post('/deleteComplaint', function(req, res, next) {
  let complaint = req.body.params.complaint
  const deletComplaint = models.complaint
    .destroy({
      where: {
        id: complaint.id
      }
    })
    .then(complaint => {
      if (complaint != null) {
        res.json({ state: 200, message: '删除成功' })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 批量删除投诉信息
router.post('/deleteComplaintList', function(req, res, next) {
  let complaintList = req.body.params.complaintList
  return new Promise((resolve, reject) => {
    if (!complaintList) {
      reject(error)
    } else if (complaintList.length != 0) {
      complaintList.forEach(item => {
        const complaint = models.complaint.destroy({
          where: {
            id: item.id
          }
        })
      })
      resolve()
    }
  })
    .then(() => {
      res.json({ state: 200, message: '删除成功' })
    })
    .catch(() => {
      res.json({ state: 400 })
    })
})

// 获取业主对应的投诉信息
router.post('/getOwnerComplaint', function(req, res, next) {
  let ownerInfo = req.body.params.ownerInfo
  const complaintList = models.complaint
    .findAll({
      where: {
        complaintOwner: ownerInfo.ownerName,
        complaintOwnerCard: ownerInfo.ownerCard
      }
    })
    .then(complaintList => {
      if (complaintList != null) {
        res.json({ state: 200, complaintList: complaintList })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 业主提交投诉信息
router.post('/referOwnerComplaint', function(req, res, next) {
  let complaintRefer = req.body.params.complaintRefer
  complaintRefer.complaintReply = ''
  complaintRefer.ownerReadState = false
  complaintRefer.readState = false
  const compliant = models.complaint.create(complaintRefer).then(complaint => {
    if (complaint != null) {
      res.json({ state: 200, message: '提交成功' })
    } else {
      res.json({ state: 400 })
    }
  })
})

// 业主标注已读
router.post('/complaintOwnerRead', function(req, res, next) {
  let complaintInfo = req.body.params.complaintInfo
  complaintInfo.ownerReadState = true
  const read = models.complaint
    .update(complaintInfo, {
      where: {
        id: complaintInfo.id
      }
    })
    .then(complaint => {
      if (complaint != null) {
        res.json({ state: 200 })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 回复业主
router.post('/referComplaint', function(req, res, next) {
  const complaintInfo = req.body.params.complaintInfo
  complaintInfo.ownerReadState = false
  const referOwner = models.complaint
    .update(complaintInfo, {
      where: {
        id: complaintInfo.id
      }
    })
    .then(referOnwer => {
      if (referOwner != null) {
        res.json({ state: 200, message: '回复成功' })
      } else {
        res.json({ state: 400 })
      }
    })
})

module.exports = router
