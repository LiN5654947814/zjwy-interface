const express = require('express')
const bodyParser = require('body-parser')

const app = express()
// 业主表接口
const owners = require('./routes/owner')
// 房产表接口
const estate = require('./routes/estate')
// 车位表接口
const parking = require('./routes/parking')
// 报修接口
const fix = require('./routes/fix')
// 投诉接口
const complaint = require('./routes/complaint')
// 缴费表接口
const pay = require('./routes/pay')
// 登录接口
const login = require('./routes/login')
// 首页接口
const main = require('./routes/main')

app.all('*', function(req, res, next) {
  // 设置跨域
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(login)
app.use(owners)
app.use(estate)
app.use(parking)
app.use(fix)
app.use(complaint)
app.use(pay)
app.use(main)

app.listen(3000, function() {
  console.log('Server Running 3000')
})
