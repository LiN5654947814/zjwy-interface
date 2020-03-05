const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op
const writeXls = require('../export')
const tools = require('../tools')

// 查询所有业主
router.get('/getAllOwner', function(req, res, next) {
  const ownerList = models.owner
    .findAll({
      include: [models.estate, models.parking],
      order: [['ownerMoveDate', 'desc']]
    })
    .then(owners => {
      if (owners != null) {
        // 移除管理员
        owners = JSON.parse(JSON.stringify(owners))
        owners.forEach((item, index) => {
          if (item.author === true) {
            owners.splice(index, 1)
          }
        })
        res.json({ state: 200, owners: owners })
      } else {
        res.jons({ state: 400 })
      }
    })
})

// 新增业主信息
router.post('/addOwner', function(req, res, next) {
  let tool = new tools()
  let ownerInfo = req.body.params.owner
  ownerInfo.ownerMoveDate = ''
  ownerInfo.author = false
  // 邮箱正则验证
  console.log(ownerInfo)
  if (
    !ownerInfo.ownerName &&
    !ownerInfo.ownerEmail &&
    !ownerInfo.ownerCard &&
    !ownerInfo.ownerPhone &&
    !ownerInfo.ownerSex &&
    !ownerInfo.originalPassword
  ) {
    res.json({ state: 401, message: '请输入相应的业主信息' })
  } else if (!ownerInfo.ownerName || ownerInfo.ownerName.trim().length === 0) {
    res.json({ state: 401, message: '业主姓名不能为空' })
  } else if (
    !ownerInfo.ownerEmail ||
    ownerInfo.ownerEmail.trim().length === 0
  ) {
    res.json({ state: 401, message: '业主邮箱不能为空' })
  } else if (!ownerInfo.ownerCard || ownerInfo.ownerCard.trim().length === 0) {
    res.json({ state: 401, message: '业主身份证不能为空' })
  } else if (
    !ownerInfo.ownerPhone ||
    ownerInfo.ownerPhone.trim().length === 0
  ) {
    res.json({ state: 401, message: '业主手机不能为空' })
  } else if (!ownerInfo.ownerSex || ownerInfo.ownerSex.trim().length === 0) {
    res.json({ state: 401, message: '业主性别不能为空' })
  } else if (
    !ownerInfo.originalPassword ||
    ownerInfo.originalPassword.trim().length === 0
  ) {
    res.json({ state: 401, message: '业主初始密码不能为空' })
  } else if (ownerInfo.originalPassword.trim().length > 6) {
    res.json({ state: 401, message: '请设置6位数的密码' })
  } else if (tool.passwordTest(ownerInfo.originalPassword) === false) {
    res.json({ state: 401, message: '密码不能有空格' })
  } else if (tool.cardTest(ownerInfo.ownerCard) === false) {
    res.json({ state: 401, message: '请输入正确的身份证号码' })
  } else if (tool.phoneTest(ownerInfo.ownerPhone) === false) {
    res.json({ state: 401, message: '请输入正确的手机号' })
  } else if (tool.emailTest(ownerInfo.ownerEmail) === false) {
    res.json({ state: 401, message: '请输入正确的邮箱' })
  }
  // 新增之前判断身份证是否唯一
  else if (ownerInfo.ownerCard) {
    let owner = models.owner
      .findOne({
        where: {
          ownerCard: ownerInfo.ownerCard,
          ownerName: ownerInfo.ownerName
        }
      })
      .then(owner => {
        if (owner === null) {
          let owner = models.owner
            .findOne({
              where: {
                ownerEmail: ownerInfo.ownerEmail
              }
            })
            .then(owner => {
              if (owner === null) {
                let owner = models.owner
                  .findOne({
                    where: {
                      ownerPhone: ownerInfo.ownerPhone
                    }
                  })
                  .then(async owner => {
                    if (owner === null) {
                      const owner = models.owner
                        .create(ownerInfo)
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
          res.json({ state: 401, message: '业主已存在' })
        }
      })
  }
})

// 删除单个业主信息
router.post('/deleteOwner', function(req, res, next) {
  const estate = models.estate
    .findOne({
      where: {
        estateOwnerCard: req.body.params.ownerCard
      }
    })
    .then(estate => {
      if (estate === null) {
        const parking = models.parking
          .findOne({
            where: {
              parkingOwnerCard: req.body.params.ownerCard
            }
          })
          .then(parking => {
            if (parking === null) {
              const destroyOwner = models.owner
                .destroy({
                  where: {
                    id: req.body.params.id
                  }
                })
                .then(owner => {
                  if (owner != null) {
                    res.json({ state: 200, message: '删除成功' })
                  } else {
                    res.json({ state: 400 })
                  }
                })
            } else {
              res.json({
                state: 401,
                message: '无法删除，请先解除该业主名下的车位信息'
              })
            }
          })
      } else {
        res.json({
          state: 401,
          message: '无法删除，请先解除该业主名下的房产信息'
        })
      }
    })
})

// 批量删除
router.post('/deleteOwners', function(req, res, next) {
  let deleteOwnerList = req.body.params.deleteOwners
  return new Promise((resolve, reject) => {
    let currentList = []
    if (!deleteOwnerList) {
      reject(error)
    } else if (deleteOwnerList.length != 0) {
      deleteOwnerList.forEach((item, index) => {
        let estate = models.estate
          .findOne({
            where: {
              estateOwnerCard: item.ownerCard
            }
          })
          .then(estate => {
            if (estate === null) {
              const parking = models.parking
                .findOne({
                  where: {
                    parkingOwnerCard: item.ownerCard
                  }
                })
                .then(parking => {
                  if (parking === null) {
                    const owner = models.owner.destroy({
                      where: {
                        id: item.id
                      }
                    })
                  } else {
                    currentList.push(item)
                  }
                })
            } else {
              currentList.push(item)
            }
          })
      })
      resolve(currentList)
    }
  })
    .then(currentList => {
      console.log(deleteOwnerList)
      res.json({
        state: 200,
        message:
          '执行成功，若存在未能删除业主，请检查其名下是否解除相关的物业绑定'
      })
    })
    .catch(error => {
      res.json({ state: 400 })
    })
})

// 搜索功能
router.post('/searchOwner', function(req, res, next) {
  let ownerSearch = req.body.params.currentInfo
  console.log(ownerSearch)
  if (
    ownerSearch.ownerName.trim().length !== 0 &&
    ownerSearch.moveDate.length === 0
  ) {
    console.log('姓名不为空，日期为空')
    const ownerList = models.owner
      .findAll({
        where: {
          ownerName: {
            [Op.like]: '%' + ownerSearch.ownerName + '%'
          }
        },
        include: [models.estate, models.parking]
      })
      .then(ownerInfo => {
        if (ownerInfo != null) {
          res.json({ state: 200, ownerInfo: ownerInfo })
        } else {
          res.json({ state: 400 })
        }
      })
  } else if (
    ownerSearch.moveDate.length !== 0 &&
    ownerSearch.ownerName.trim().length === 0
  ) {
    console.log('姓名为空，日期不为空')
    const ownerList = models.owner
      .findAll({
        where: {
          ownerMoveDate: {
            [Op.between]: [ownerSearch.moveDate[0], ownerSearch.moveDate[1]]
          }
        },
        include: [models.estate, models.parking]
      })
      .then(ownerInfo => {
        console.log(ownerInfo)
        if (ownerInfo != null) {
          res.json({ state: 200, ownerInfo: ownerInfo })
        } else {
          res.json({ state: 400 })
        }
      })
  } else if (
    ownerSearch.ownerName.trim().length !== 0 &&
    ownerSearch.moveDate.length !== 0
  ) {
    console.log('姓名不为空，日期不为空')
    const ownerList = models.owner
      .findAll({
        where: {
          ownerMoveDate: {
            [Op.between]: [ownerSearch.moveDate[0], ownerSearch.moveDate[1]]
          },
          ownerName: {
            [Op.like]: '%' + ownerSearch.ownerName + '%'
          }
        },
        include: [models.estate, models.parking]
      })
      .then(ownerInfo => {
        console.log(ownerInfo)
        if (ownerInfo != null) {
          res.json({ state: 200, ownerInfo: ownerInfo })
        } else {
          res.json({ state: 400 })
        }
      })
  }
})

// 更新/编辑业主信息
router.post('/modifyOwner', function(req, res, next) {
  let ownerInfo = req.body.params.ownerInfo
  let tool = new tools()
  console.log(ownerInfo)
  // 新增之前判断身份证邮箱是否唯一
  if (
    !ownerInfo.ownerName &&
    !ownerInfo.ownerEmail &&
    !ownerInfo.ownerCard &&
    !ownerInfo.ownerPhone &&
    !ownerInfo.ownerSex &&
    !ownerInfo.originalPassword
  ) {
    res.json({ state: 401, message: '请输入相应的业主信息' })
  } else if (!ownerInfo.ownerName || ownerInfo.ownerName.trim().length === 0) {
    res.json({ state: 401, message: '业主姓名不能为空' })
  } else if (
    !ownerInfo.ownerEmail ||
    ownerInfo.ownerEmail.trim().length === 0
  ) {
    res.json({ state: 401, message: '业主邮箱不能为空' })
  } else if (!ownerInfo.ownerCard || ownerInfo.ownerCard.trim().length === 0) {
    res.json({ state: 401, message: '业主身份证不能为空' })
  } else if (
    !ownerInfo.ownerPhone ||
    ownerInfo.ownerPhone.trim().length === 0
  ) {
    res.json({ state: 401, message: '业主手机不能为空' })
  } else if (!ownerInfo.ownerSex || ownerInfo.ownerSex.trim().length === 0) {
    res.json({ state: 401, message: '业主性别不能为空' })
  } else if (
    !ownerInfo.originalPassword ||
    ownerInfo.originalPassword.trim().length === 0
  ) {
    res.json({ state: 401, message: '业主初始密码不能为空' })
  } else if (tool.cardTest(ownerInfo.ownerCard) === false) {
    res.json({ state: 401, message: '请输入正确的身份证号码' })
  } else if (tool.phoneTest(ownerInfo.ownerPhone) === false) {
    res.json({ state: 401, message: '请输入正确的手机号' })
  } else if (tool.emailTest(ownerInfo.ownerEmail) === false) {
    res.json({ state: 401, message: '请输入正确的邮箱' })
  } else if (ownerInfo.originalPassword.trim().length > 6) {
    res.json({ state: 401, message: '请设置6位数的密码' })
  } else if (ownerInfo.ownerCard) {
    let owner = models.owner
      .findOne({
        where: {
          ownerCard: ownerInfo.ownerCard
        }
      })
      .then(owner => {
        if (owner.id === ownerInfo.id) {
          let owner = models.owner
            .findOne({
              where: {
                ownerEmail: ownerInfo.ownerEmail
              }
            })
            .then(owner => {
              if (owner.id === ownerInfo.id) {
                let owner = models.owner
                  .findOne({
                    where: {
                      ownerPhone: ownerInfo.ownerPhone
                    }
                  })
                  .then(owner => {
                    if (owner.id === ownerInfo.id) {
                      const modifyOwner = models.owner
                        .update(ownerInfo, {
                          where: {
                            id: ownerInfo.id
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
  let tool = new tools()
  let ownerInfo = req.body.params.ownerInfo
  if (
    !ownerInfo.inputOriginalPassword ||
    ownerInfo.inputOriginalPassword.trim().length === 0
  ) {
    res.json({ state: 401, message: '请输入原密码' })
  } else if (
    !ownerInfo.newPassword ||
    ownerInfo.newPassword.length === 0 ||
    ownerInfo.newPassword.trim().length < 6
  ) {
    res.json({ state: 401, message: '请输入新密码,且不能超过6位' })
  } else if (tool.passwordTest(ownerInfo.newPassword) === false) {
    res.json({ state: 401, message: '密码不可带有空格，且不能超过6位' })
  } else if (
    !ownerInfo.newPassword_ ||
    ownerInfo.newPassword_.trim().lengt == 0
  ) {
    res.json({ state: 401, message: '请再次输入新密码' })
  } else if (ownerInfo.newPassword_ != ownerInfo.newPassword) {
    res.json({ state: 401, message: '新密码输入不一致' })
  } else {
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
  }
})

// 导出全部Excel文件
router.get('/exportOwnerExcel', async function(req, res, next) {
  // 从数据库查询信息
  const ownerList = await models.owner.findAll({
    include: [models.estate, models.parking]
  })
  // 转化为JSON数组对象格式
  let ownerListJson = JSON.parse(JSON.stringify(ownerList))
  let data = []
  // 设置excel列样式
  let options = {
    '!cols': [
      { wch: 6 },
      { wch: 7 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 7 },
      { wch: 7 },
      { wch: 20 }
    ]
  }
  // 生成excel表头
  let title = [
    '姓名',
    '性别',
    '身份证',
    '邮箱',
    '联系手机号',
    '所在楼宇单元',
    '房产数',
    '车位数',
    '迁入时间'
  ]
  data.push(title)
  let currentList = []
  // 移除管理员
  ownerListJson.forEach((item, index) => {
    if (item.author === false) {
      currentList.push(item)
    }
  })
  // 导入数据
  currentList.forEach((item, index) => {
    let arrInner = []
    arrInner.push(item.ownerName)
    arrInner.push(item.ownerSex)
    arrInner.push(item.ownerCard)
    arrInner.push(item.ownerEmail)
    arrInner.push(item.ownerPhone)
    if (item.estates.length != 0) {
      arrInner.push(
        item.estates[0].estateBuilds +
          '-' +
          item.estates[0].estateUnit +
          '-' +
          item.estates[0].estatePlate
      )
    } else {
      arrInner.push('未登记')
    }
    if (item.estates.length != 0) {
      arrInner.push(item.estates.length)
    } else {
      arrInner.push('0')
    }
    if (item.parkings.length != 0) {
      arrInner.push(item.parkings.length)
    } else {
      arrInner.push('0')
    }
    if (item.estates.length != 0) {
      arrInner.push(item.estates[0].ownerMoveDate)
    } else {
      arrInner.push('未迁入')
    }

    data.push(arrInner)
  })
  writeXls(data, options, res)
})

//批量导出
router.post('/exportOwnerExcelBySelect', async function(req, res, next) {
  const exportList = req.body.params.exportList
  if (exportList.length === 0) {
    return
  }
  let data = []
  let options = {
    '!cols': [
      { wch: 6 },
      { wch: 7 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 7 },
      { wch: 7 },
      { wch: 20 }
    ]
  }
  let title = [
    '姓名',
    '性别',
    '身份证',
    '邮箱',
    '联系手机号',
    '所在楼宇单元',
    '房产数',
    '车位数',
    '迁入时间'
  ]
  data.push(title)
  exportList.forEach((item, index) => {
    let arrInner = []
    arrInner.push(item.ownerName)
    arrInner.push(item.ownerSex)
    arrInner.push(item.ownerCard)
    arrInner.push(item.ownerEmail)
    arrInner.push(item.ownerPhone)
    if (item.estates.length != 0) {
      arrInner.push(
        item.estates[0].estateBuilds +
          '-' +
          item.estates[0].estateUnit +
          '-' +
          item.estates[0].estatePlate
      )
    } else {
      arrInner.push('未登记')
    }
    if (item.estates.length != 0) {
      arrInner.push(item.estates.length)
    } else {
      arrInner.push('0')
    }
    if (item.parkings.length != 0) {
      arrInner.push(item.parkings.length)
    } else {
      arrInner.push('0')
    }
    if (item.estates.length != 0) {
      arrInner.push(item.estates[0].ownerMoveDate)
    } else {
      arrInner.push('未迁入')
    }
    data.push(arrInner)
  })
  writeXls(data, options, res)
})

module.exports = router
