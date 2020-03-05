const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op
const tools = require('../tools')

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
        complaintOwnerPhone: ownerInfo.ownerPhone
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
  let tool = new tools()
  let complaintRefer = req.body.params.complaintRefer
  complaintRefer.complaintReply = ''
  complaintRefer.ownerReadState = false
  complaintRefer.readState = false
  if (
    !complaintRefer.complaintOwner ||
    complaintRefer.complaintOwner.trim().length === 0
  ) {
    res.json({ state: 401, message: '请输入姓名' })
  } else if (!complaintRefer.complaintType) {
    res.json({ state: 401, message: '请选择投诉类型' })
  } else if (!complaintRefer.complaintTime) {
    res.json({ state: 401, message: '请选择投诉日期' })
  } else if (
    !complaintRefer.complaintOwnerUnit ||
    complaintRefer.complaintOwnerUnit.trim().length === 0
  ) {
    res.json({ state: 401, message: '请输入所在单元' })
  } else if (
    !complaintRefer.complaintOwnerPhone ||
    complaintRefer.complaintOwnerPhone.trim().length === 0
  ) {
    res.json({ state: 401, message: '请输入手机号' })
  } else if (tool.phoneTest(complaintRefer.complaintOwnerPhone) === false) {
    res.json({ state: 401, message: '请输入正确的手机号' })
  } else if (
    !complaintRefer.complaintContent ||
    complaintRefer.complaintContent.trim().length === 0
  ) {
    res.json({ state: 401, message: '请输入投诉内容' })
  } else if (complaintRefer.complaintContent.trim().length > 500) {
    res.json({ state: 401, message: '投诉信息不能超过500字' })
  } else {
    const owner = models.owner
      .findOne({
        where: {
          ownerName: complaintRefer.complaintOwner,
          ownerPhone: complaintRefer.complaintOwnerPhone
        }
      })
      .then(owner => {
        if (owner === null) {
          res.json({ state: 401, message: '业主不存在或联系方式不匹配' })
        } else {
          const compliant = models.complaint
            .create(complaintRefer)
            .then(complaint => {
              if (complaint != null) {
                res.json({ state: 200, message: '提交成功' })
              } else {
                res.json({ state: 400 })
              }
            })
        }
      })
  }
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
  if (
    complaintInfo.complaintReply.trim().length === 0 ||
    !complaintInfo.complaintReply
  ) {
    res.json({ state: 401, message: '请输入回复信息' })
  } else {
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
  }
})

module.exports = router
