const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op

// 获取所有报修信息
router.get('/getAllFix', async function(req, res, next) {
  const fixList = await models.fix.findAll().then(fixList => {
    if (fixList != null) {
      res.json({ state: 200, fixList: fixList })
    } else {
      res.json({ state: 400 })
    }
  })
})

// 按条件搜索报修信息
router.post('/searchFix', async function(req, res, next) {
  let fixInfo = req.body.params.fixInfo
  if (!fixInfo.fixStartTime) {
    fixInfo.fixStartTime = ''
  }
  if (!fixInfo.fixOwner) {
    fixInfo.fixOwner = ''
  }
  if (!fixInfo.fixState) {
    fixInfo.fixState = ''
  }
  let where = {
    fixStartTime: {
      [Op.gte]: fixInfo.fixStartTime
    },
    fixOwner: {
      [Op.like]: '%' + fixInfo.fixOwner + '%'
    },
    fixState: {
      [Op.like]: '%' + fixInfo.fixState + '%'
    }
  }

  const fixList = await models.fix
    .findAll({
      where: where
    })
    .then(fixList => {
      if (fixList != null) {
        res.json({ state: 200, fixList: fixList })
      } else {
        res.json({ state: 400 })
      }
    })
})

module.exports = router
