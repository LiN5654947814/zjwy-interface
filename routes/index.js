const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const secret = 'ZjWy'
// 业主表接口
const owners = require('./owner')
// 房产表接口
const estate = require('./estate')
// 车位表接口
const parking = require('./parking')
// 报修接口
const fix = require('./fix')
// 投诉接口
const complaint = require('./complaint')
// 缴费表接口
const pay = require('./pay')
// 登录接口
const login = require('./login')
// 首页接口
const main = require('./main')
// token验证
const jwtAuth = require('./jwt')

// router.use(jwtAuth)
router.use((err, req, res, next) => {
  if (err && err.name === 'UnauthorizedError') {
    return res.json({ state: 404, message: '登录过期或无效，请重新登录' })
  }
})
router.use(login)
router.use(owners)
router.use(estate)
router.use(parking)
router.use(fix)
router.use(complaint)
router.use(pay)
router.use(main)

module.exports = router
