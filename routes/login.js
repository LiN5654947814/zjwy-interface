const express = require('express')
const router = express.Router()
const models = require('../models')
const jwt = require('jsonwebtoken')

// 登录
router.post('/login', async function(req, res, next) {
  let username = req.body.params.username
  let password = req.body.params.password
  // 加密的密钥
  const secret = 'ZjWy'
  let user = await models.owner
    .findOne({
      where: {
        ownerEmail: username,
        originalPassword: password
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
        res.json({
          state: 200,
          token: token,
          author: admin.author,
          ownerPhone: admin.ownerPhone,
          ownerName: admin.ownerName,
          ownerCard: admin.ownerCard
        })
      } else {
        res.json({ state: 400 })
      }
      console.log(req)
    })
})

// 检测token
router.post('/checkUser', (req, res) => {})

module.exports = router
