const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op

// 获取所有报修信息
router.get('/getAllFix', function(req, res, next) {
  const fixList = models.fix.findAll().then(fixList => {
    if (fixList != null) {
      res.json({ state: 200, fixList: fixList })
    } else {
      res.json({ state: 400 })
    }
  })
})

// 按条件搜索报修信息
router.post('/searchFix', function(req, res, next) {
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

  const fixList = models.fix
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

// 新增报修信息
router.post('/addFix', function(req, res, next) {
  console.log(req.body.params)
  let fixInfo = req.body.params.fixInfo
  const fix = models.fix.create(fixInfo).then(fix => {
    if (fix != null) {
      res.json({ state: 200, message: '添加成功' })
    } else {
      res.json({ state: 400 })
    }
  })
})

// 删除报修信息
router.post('/deleteFix', function(req, res, next) {
  const fixInfo = req.body.params.fixInfo
  const fix = models.fix
    .destroy({
      where: {
        id: fixInfo.id
      }
    })
    .then(fix => {
      if (fix != null) {
        res.json({ state: 200, message: '删除成功' })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 批量删除
router.post('/deleteFixList', function(req, res, next) {
  const fixList = req.body.params.fixList
  return new Promise((resolve, reject) => {
    if (!fixList) {
      reject(error)
    } else if (fixList.length != 0) {
      fixList.forEach(item => {
        let fix = models.fix.destroy({
          where: {
            id: item.id
          }
        })
      })
      resolve()
    }
  })
    .then(data => {
      res.json({ state: 200, message: '删除成功' })
    })
    .catch(error => {
      res.json({ state: 400 })
    })
})

// 根据业主获取他的报修信息
router.post('/getOwnerFix', function(req, res, next) {
  let ownerInfo = req.body.params.ownerInfo
  const ownerFixList = models.fix
    .findAll({
      where: {
        fixOwner: ownerInfo.ownerName,
        fixOwnerCard: ownerInfo.ownerCard
      }
    })
    .then(ownerFixList => {
      if (ownerFixList != null) {
        res.json({ state: 200, ownerFixList: ownerFixList })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 业主提交报修信息
router.post('/referOwnerFix', function(req, res, next) {
  let fixInfo = req.body.params.fixInfo
  const fix = models.fix.create(fixInfo).then(fix => {
    if (fix != null) {
      res.json({ state: 200, message: '提交成功' })
    } else {
      res.json({ state: 400 })
    }
  })
})

// 变更报修信息
router.post('/modifyFixDetail', function(req, res, next) {
  let fixDetail = req.body.params.fixDetail
  const fix = models.fix
    .update(fixDetail, {
      where: {
        id: fixDetail.id
      }
    })
    .then(fix => {
      if (fix != null) {
        res.json({ state: 200, message: '变更成功' })
      } else {
        res.json({ state: 400 })
      }
    })
})
module.exports = router
