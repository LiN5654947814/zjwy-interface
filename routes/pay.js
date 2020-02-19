const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op

// 获取所有收费信息
router.get('/getAllPay', function(req, res, next) {
  const payList = models.pay.findAll().then(payList => {
    if (payList != null) {
      res.json({ state: 200, payList: payList })
    } else {
      res.json({ state: 400 })
    }
  })
})

// 按条件搜索缴费信息
router.post('/searchPay', function(req, res, next) {
  let paySearch = req.body.params.paySearch
  if (!paySearch.payOwner) {
    paySearch.payOwner = ''
  }
  if (!paySearch.payState) {
    paySearch.payState = ''
  }
  if (!paySearch.payDate) {
    paySearch.payDate = ''
  }
  let where = {
    payOwner: {
      [Op.like]: '%' + paySearch.payOwner + '%'
    },
    payState: {
      [Op.like]: '%' + paySearch.payState + '%'
    },
    payDate: {
      [Op.like]: '%' + paySearch.payDate + '%'
    }
  }
  const payList = models.pay
    .findAll({
      where: where,
      order: [['id', 'ASC']]
    })
    .then(payList => {
      if (payList != null) {
        res.json({ state: 200, payList: payList })
      } else {
        res.json({ state: 400 })
      }
    })
})

//切换缴费状态
router.post('/payStateChange', function(req, res, next) {
  let payInfo = req.body.params.payInfo
  payInfo.payState = '已缴费'
  let pay = models.pay
    .update(payInfo, {
      where: {
        id: payInfo.id
      }
    })
    .then(pay => {
      if (pay != null) {
        res.json({ state: 200, message: '已修改缴费状态' })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 新增缴费信息
router.post('/addPay', function(req, res, next) {
  let payInfo = req.body.params.payInfo
  const owner = models.owner
    .findOne({
      where: {
        ownerName: payInfo.payOwner,
        ownerPhone: payInfo.payOwnerPhone
      }
    })
    .then(owner => {
      if (owner != null) {
        const pay = models.pay.create(payInfo).then(pay => {
          if (pay != null) {
            res.json({ state: 200, message: '添加成功' })
          } else {
            res.json({ state: 400 })
          }
        })
      } else {
        res.json({ state: 401, message: '用户不存在或与手机号不匹配，请检查' })
      }
    })
})

// 删除单条缴费信息
router.post('/deletePay', function(req, res, next) {
  let payInfo = req.body.params.payInfo
  const pay = models.pay
    .destroy({
      where: {
        id: payInfo.id
      }
    })
    .then(pay => {
      if (pay != null) {
        res.json({ state: 200, message: '删除成功' })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 批量删除
router.post('/deletePayList', function(req, res, next) {
  let payList = req.body.params.payList
  return new Promise((resolve, reject) => {
    if (!payList) {
      reject(error)
    } else if (payList.length != 0) {
      payList.forEach(item => {
        const pay = models.pay.destroy({
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
    .catch(error => {
      res.json({ state: 400 })
    })
})
module.exports = router
