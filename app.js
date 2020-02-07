const express = require('express')
const bodyParser = require('body-parser')

const app = express()
// 管理员登录表
const user_admin = require('./routes/user_admin')
// 业主表接口
const owners = require('./routes/owner')
// 房产表接口
const estate = require('./routes/estate')

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
app.use(user_admin)
app.use(owners)
app.use(estate)

app.listen(3000, function() {
  console.log('Server Running 3000')
})
