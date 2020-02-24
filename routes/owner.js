const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op
const xlsx = require('xlsx')
// 查询所有业主
router.get('/getAllOwner', function(req, res, next) {
  const ownerList = models.owner
    .findAll({
      include: [models.estate, models.parking]
    })
    .then(owners => {
      if (owners != null) {
        res.json({ state: 200, owners: owners })
      } else {
        res.jons({ state: 400 })
      }
    })
})

// 新增业主信息
router.post('/addOwner', function(req, res, next) {
  // 新增之前判断身份证是否唯一
  if (req.body.params.ownerCard) {
    let owner = models.owner
      .findOne({
        where: {
          ownerCard: req.body.params.ownerCard
        }
      })
      .then(owner => {
        if (owner === null) {
          let owner = models.owner
            .findOne({
              where: {
                ownerEmail: req.body.params.ownerEmail
              }
            })
            .then(owner => {
              if (owner === null) {
                let owner = models.owner
                  .findOne({
                    where: {
                      ownerPhone: req.body.params.ownerPhone
                    }
                  })
                  .then(async owner => {
                    if (owner === null) {
                      const owner = models.owner
                        .create(req.body.params)
                        .then(flag => {
                          if (flag) {
                            res.json({ state: 200, message: '添加成功' })
                          } else {
                            res.json({ state: 400 })
                          }
                        })
                    } else {
                      res.json({ state: 401, message: '手机号重复,已存在' })
                    }
                  })
              } else {
                res.json({ state: 401, message: '邮箱重复，已存在' })
              }
            })
        } else {
          res.json({ state: 401, message: '身份证重复，已存在' })
        }
      })
  }
})

// 删除单个业主信息
router.post('/deleteOwner', function(req, res, next) {
  const deleteOwner = models.owner
    .destroy({
      where: {
        id: req.body.params.id,
        ownerCard: req.body.params.ownerCard
      }
    })
    .then(owner => {
      if (owner) {
        res.json({ state: 200, message: '删除成功' })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 批量删除
router.post('/deleteOwners', function(req, res, next) {
  return new Promise((resolve, reject) => {
    if (!req.body.params.deleteOwners) {
      reject(error)
    } else if (req.body.params.deleteOwners.length != 0) {
      req.body.params.deleteOwners.forEach(item => {
        const deleteActive = models.owner.destroy({
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

// 搜索功能
router.post('/searchOwner', function(req, res, next) {
  let where = {}
  // 业主名不为空，日期为空时
  if (
    req.body.params.ownerName != '' &&
    req.body.params.ownerMoveDate.length === 0
  ) {
    where.ownerName = {
      [Op.like]: '%' + req.body.params.ownerName + '%'
    }
    let owner = models.owner
      .findAll({
        order: [['id', 'DESC']],
        where: where,
        include: [models.estate]
      })
      .then(owners => {
        if (owners != null) {
          res.json({ state: 200, ownerInfo: owners })
        } else {
          res.json({ state: 400 })
        }
      })
  }
  // 业主名为空，日期不为空
  if (
    req.body.params.ownerMoveDate.length != 0 &&
    req.body.params.ownerName === ''
  ) {
    where.ownerMoveDate = {
      [Op.between]: [
        req.body.params.ownerMoveDate[0],
        req.body.params.ownerMoveDate[1]
      ]
    }
    let owner = models.estate.findAll({
      order: [['id', 'DESC']],
      where: where,
      include: [models.owner]
    })
    res.json({ state: 200, ownerInfo: owner })
  }
  // 业主名和日期都不为空时
  if (
    req.body.params.ownerMoveDate.length != 0 &&
    req.body.params.ownerName != ''
  ) {
    where.ownerMoveDate = {
      [Op.between]: [
        req.body.params.ownerMoveDate[0],
        req.body.params.ownerMoveDate[1]
      ]
    }
    where.estateOwner = {
      [Op.like]: '%' + req.body.params.ownerName + '%'
    }
    let owner = models.estate.findAll({
      order: [['id', 'DESC']],
      where: where,
      include: [models.owner]
    })
    res.json({ state: 200, ownerInfo: owner })
  }
  // 都为空时
  if (
    req.body.params.ownerMoveDate.length === 0 &&
    req.body.params.ownerName === ''
  ) {
    const owner = models.owner.findAll().then(owners => {
      if (owners != null) {
        res.json({ state: 200, owners: owners })
      } else {
        res.json({ state: 400 })
      }
    })
  }
})

// 更新/编辑业主信息
router.post('/modifyOwner', function(req, res, next) {
  // 新增之前判断身份证是否唯一
  if (req.body.params.ownerCard) {
    let owner = models.owner
      .findOne({
        where: {
          ownerCard: req.body.params.ownerCard
        }
      })
      .then(owner => {
        if (owner.id === req.body.params.id) {
          let owner = models.owner
            .findOne({
              where: {
                ownerEmail: req.body.params.ownerEmail
              }
            })
            .then(owner => {
              if (owner.id === req.body.params.id) {
                let owner = models.owner
                  .findOne({
                    where: {
                      ownerPhone: req.body.params.ownerPhone
                    }
                  })
                  .then(owner => {
                    if (owner.id === req.body.params.id) {
                      const modifyOwner = models.owner
                        .update(req.body.params, {
                          where: {
                            id: req.body.params.id
                          }
                        })
                        .then(flag => {
                          if (flag) {
                            res.json({ state: 200, message: '编辑成功' })
                          } else {
                            res.json({ state: 400 })
                          }
                        })
                    } else {
                      res.json({ state: 401, message: '手机号重复' })
                    }
                  })
              } else {
                res.json({ state: 401, message: '邮箱重复' })
              }
            })
        } else {
          res.json({ state: 401, message: '身份证重复' })
        }
      })
  }
})

// 根据名字身份证手机号获取业主信息
router.post('/getOwner', function(req, res, next) {
  let ownerInfo = req.body.params.ownerInfo
  const owner = models.owner
    .findOne({
      where: {
        ownerCard: ownerInfo.ownerCard,
        ownerName: ownerInfo.ownerName,
        ownerPhone: ownerInfo.ownerPhone
      },
      include: [models.estate, models.parking]
    })
    .then(owner => {
      if (owner != null) {
        res.json({ state: 200, owner: owner })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 业主修改密码
router.post('/modifyPassword', function(req, res, next) {
  let ownerInfo = req.body.params.ownerInfo
  const owner = models.owner
    .findOne({
      where: {
        ownerCard: ownerInfo.ownerCard,
        ownerName: ownerInfo.ownerName,
        ownerPhone: ownerInfo.ownerPhone
      }
    })
    .then(owner => {
      if (owner.originalPassword === ownerInfo.inputOriginalPassword) {
        const modifyPassowd = models.owner
          .update(
            { originalPassword: ownerInfo.newPassword },
            {
              where: {
                ownerCard: ownerInfo.ownerCard,
                ownerName: ownerInfo.ownerName
              }
            }
          )
          .then(modify => {
            if (modify != null) {
              res.json({ state: 200, message: '修改成功，请重新登录' })
            } else {
              res.json({ state: 400 })
            }
          })
      } else {
        res.json({ state: 401, message: '原密码错误' })
      }
    })
})

// 导出业主表
// router.get('/exportOwnerExcel', async function(req, res, next) {
//   const ownerList = await models.owner.findAll({
//     include: [models.estate, models.parking]
//   })
//   const ownerListJson = JSON.parse(JSON.stringify(ownerList))
//   let data = []
//   let title = ['业主姓名', '性别', '联系手机号']
//   ownerListJson.forEach(item => {
//     let arrInner = []
//     arrInner.push(item.ownerName)
//     arrInner.push(item.ownerSex)
//     arrInner.push(item.ownerPhone)
//     data.push(arrInner)
//   })
//   let result = xlsx.build([{ name: '业主表', data: data }])
//   res.setHeader('Content-Type', 'application/vnd.openxmlformats')
//   res.setHeader(
//     'Content-Disposition',
//     'attachment:filename="+encodeURLComponent("XXXXX")+".xlsx'
//   )
//   res.end(result, 'binary')
// })

module.exports = router
