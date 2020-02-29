const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op
const writeXls = require('../export')

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
  console.log(paySearch)
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
      if (payList != null && payList.length === 0) {
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
  payInfo.payCalling = false
  const owner = models.owner
    .findOne({
      where: {
        ownerName: payInfo.payOwner,
        ownerCard: payInfo.payOwnerCard
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
        res.json({ state: 401, message: '用户不存在或信息不匹配，请检查' })
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

// 发送催缴信息
router.post('/sendCalling', function(req, res, next) {
  let payInfo = req.body.params.payInfo
  payInfo.payCalling = true
  const pay = models.pay
    .findOne({
      where: {
        id: payInfo.id
      }
    })
    .then(pay => {
      if (pay.payCalling === true) {
        res.json({ state: 202, message: '您已发送过催缴信息' })
      } else if (pay.payState === '已缴费') {
        res.json({ state: 204, message: '该业主已缴费' })
      } else {
        const pays = models.pay
          .update(payInfo, {
            where: {
              id: payInfo.id
            }
          })
          .then(payInfo => {
            if (payInfo != null) {
              res.json({ state: 200, message: '已发送催缴信息' })
            }
          })
      }
    })
})
// 获取单个收费信息
router.post('/getOnwerPay', function(req, res, next) {
  const ownerInfo = req.body.params.ownerInfo
  const pay = models.pay
    .findOne({
      where: {
        payOwner: ownerInfo.ownerName,
        payOwnerCard: ownerInfo.ownerCard,
        payDate: ownerInfo.payDate
      }
    })
    .then(pay => {
      if (pay != null) {
        res.json({ state: 200, pay: pay })
      } else {
        res.json({ state: 401, message: '当月缴费单未出' })
      }
    })
})

// 业主确认催缴信息
router.post('/receiveCalling', function(req, res, next) {
  let ownerInfo = req.body.params.ownerInfo
  ownerInfo.payCalling = false
  const pay = models.pay
    .update(ownerInfo, {
      where: {
        payOwner: ownerInfo.ownerName,
        payOwnerCard: ownerInfo.ownerCard,
        payDate: ownerInfo.payDate
      }
    })
    .then(pay => {
      if (pay != null) {
        res.json({ state: 200 })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 查询所有收费信息，按月返回
router.get('/getAllPayByMonth', async function(req, res, next) {
  let currentList = new Array()
  let y = new Date().getFullYear()
  for (let i = 1; i <= 12; i++) {
    let m = i
    if (m <= 9) {
      m = '0' + m
    }
    const pay = await models.pay.findAll({
      where: {
        payState: '已缴费',
        payDate: y + '-' + m
      }
    })
    console.log('查询一次')
    let result = JSON.parse(JSON.stringify(pay))
    currentList[i - 1] = result
  }
  res.json({ state: 200, currentList: currentList })
})

// 导出所有收费信息
router.get('/exportPay', async function(req, res, next) {
  const payList = await models.pay.findAll()
  const payListJson = JSON.parse(JSON.stringify(payList))
  let data = []
  let title = [
    '业主',
    '所在单元',
    '电梯使用费',
    '垃圾清运费',
    '公摊照明费',
    '公共管理费',
    '续费时间',
    '状态',
    '合计'
  ]
  data.push(title)
  let options = {
    '!cols': [
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 8 },
      { wch: 8 }
    ]
  }
  payListJson.forEach(item => {
    let arrInner = []
    arrInner.push(item.payOwner)
    arrInner.push(item.payOwnerUnit)
    arrInner.push(item.payElevator)
    arrInner.push(item.payGarbage)
    arrInner.push(item.payLighting)
    arrInner.push(item.payApplication)
    arrInner.push(item.payDate)
    arrInner.push(item.payState)
    item.payCount =
      item.payElevator +
      item.payLighting +
      item.payGarbage +
      item.payApplication
    arrInner.push(item.payCount)
    data.push(arrInner)
  })

  writeXls(data, options, res)
})

// 勾选导出
router.post('/exportPayList', async function(req, res, next) {
  const payList = req.body.params.payList
  let data = []
  let title = [
    '业主',
    '所在单元',
    '电梯使用费',
    '垃圾清运费',
    '公摊照明费',
    '公共管理费',
    '续费时间',
    '状态',
    '合计'
  ]
  data.push(title)
  let options = {
    '!cols': [
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 8 },
      { wch: 8 }
    ]
  }
  payList.forEach(item => {
    let arrInner = []
    arrInner.push(item.payOwner)
    arrInner.push(item.payOwnerUnit)
    arrInner.push(item.payElevator)
    arrInner.push(item.payGarbage)
    arrInner.push(item.payLighting)
    arrInner.push(item.payApplication)
    arrInner.push(item.payDate)
    arrInner.push(item.payState)
    item.payCount =
      item.payElevator +
      item.payLighting +
      item.payGarbage +
      item.payApplication
    arrInner.push(item.payCount)
    data.push(arrInner)
  })

  writeXls(data, options, res)
})
module.exports = router
