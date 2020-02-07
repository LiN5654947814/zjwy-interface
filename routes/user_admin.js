const express = require('express')
const router = express.Router()
const models = require('../models')
const jwt = require('jsonwebtoken')

// 登录
router.get('/login', async function(req, res, next) {
  let username = req.query.username
  let password = req.query.password
  // 加密的密钥
  const secret = 'ZjWy'
  let user = await models.user_admin
    .findOne({
      where: {
        username_admin: username,
        password_admin: password
      }
    })
    .then(admin => {
      const userInfo = {
        username: username,
        password: password
      }
      // 生成token 有效时间一小时
      const token = jwt.sign(userInfo, secret, { expiresIn: 60 * 60 * 1 })
      if (admin != null) {
        res.json({ state: 200, token: token })
      } else {
        res.json({ state: 400 })
      }
      console.log(req)
    })
})

// 检测token
router.post('/checkUser', (req, res) => {})

module.exports = router
