const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op
const tools = require('../tools')
// 获取所有报修信息
router.get('/getAllFix', function(req, res, next) {
  const fixList = models.fix
    .findAll({
      order: [['fixStartTime', 'DESC']]
    })
    .then(fixList => {
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
  console.log(fixInfo)
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
  let tool = new tools()
  if (!fixInfo.fixOwner || fixInfo.fixOwner.trim().length === 0) {
    res.json({ state: 401, message: '请输入业主名' })
  } else if (
    !fixInfo.fixOwnerUnit ||
    fixInfo.fixOwnerUnit.trim().length === 0
  ) {
    res.json({ state: 401, message: '请输入所在单元' })
  } else if (
    !fixInfo.fixOwnerPhone ||
    fixInfo.fixOwnerPhone.trim().length === 0
  ) {
    res.json({ state: 401, message: '请输入手机号' })
  } else if (!fixInfo.fixStartTime) {
    res.json({ state: 401, message: '请输入报修日期' })
  } else if (!fixInfo.fixState) {
    res.json({ state: 401, message: '请输入报修状态' })
  } else if (tool.phoneTest(fixInfo.fixOwnerPhone) === false) {
    res.json({ state: 401, message: '请输入正确的手机号' })
  } else if (!fixInfo.fixContent || fixInfo.fixContent.trim().length === 0) {
    res.json({ state: 401, message: '请输入报修内容' })
  } else if (fixInfo.fixContent.trim().length > 500) {
    res.json({ state: 401, message: '报修内容不得超过500字' })
  } else {
    let owner = models.owner
      .findOne({
        where: {
          ownerName: fixInfo.fixOwner,
          ownerPhone: fixDetail.fixOwnerPhone
        }
      })
      .then(owner => {
        console.log(owner)
        if (owner != null) {
          const fix = models.fix.create(fixInfo).then(fix => {
            if (fix != null) {
              res.json({ state: 200, message: '添加成功' })
            } else {
              res.json({ state: 400 })
            }
          })
        } else {
          res.json({ state: 401, message: '业主不存在或手机号匹配错误' })
        }
      })
  }
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
        fixOwnerPhone: ownerInfo.ownerPhone
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
  let tool = new tools()
  let fixInfo = req.body.params.fixInfo
  console.log(fixInfo)
  if (!fixInfo.fixOwner || fixInfo.fixOwner.trim().length === 0) {
    res.json({ state: 401, message: '业主姓名不能为空' })
  } else if (!fixInfo.fixStartTime) {
    res.json({ state: 401, message: '请输入报修提交日期' })
  } else if (
    !fixInfo.fixOwnerUnit ||
    fixInfo.fixOwnerUnit.trim().length === 0
  ) {
    res.json({ state: 401, message: '请输入所在的单元' })
  } else if (
    !fixInfo.fixOwnerPhone ||
    fixInfo.fixOwnerPhone.trim().length === 0
  ) {
    res.json({ state: 401, message: '请输入手机号' })
  } else if (tool.phoneTest(fixInfo.fixOwnerPhone) === false) {
    res.json({ state: 401, message: '请输入正确的手机号' })
  } else if (!fixInfo.fixContent || fixInfo.fixContent.trim().length === 0) {
    res.json({ state: 401, message: '请输入报修内容' })
  } else if (fixInfo.fixContent.trim().length > 500) {
    res.json({ state: 401, message: '报修内容不可超过500字' })
  } else {
    const owner = models.owner
      .findOne({
        where: {
          ownerName: fixInfo.fixOwner,
          ownerPhone: fixInfo.fixOwnerPhone
        }
      })
      .then(owner => {
        if (owner === null) {
          res.json({ state: 401, message: '业主与手机号不匹配，请检查' })
        } else {
          const fix = models.fix.create(fixInfo).then(fix => {
            if (fix != null) {
              res.json({ state: 200, message: '提交成功，请等待联系' })
            } else {
              res.json({ state: 400 })
            }
          })
        }
      })
  }
})

// 变更报修信息
router.post('/modifyFixDetail', function(req, res, next) {
  let fixDetail = req.body.params.fixDetail
  console.log(fixDetail)
  const owner = models.owner
    .findOne({
      where: {
        ownerName: fixDetail.fixOwner,
        ownerPhone: fixDetail.fixOwnerPhone
      }
    })
    .then(owner => {
      if (owner != null) {
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
      } else {
        res.json({ state: 401, message: '业主不存在或联系方式不匹配' })
      }
    })
})
module.exports = router
