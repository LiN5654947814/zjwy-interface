const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op
const writeXls = require('../export')

// 获取所有登记的房产
router.get('/getAllRegisterEstate', async function(req, res, next) {
  const registerEstate = await models.estate.findAll({
    order: [['id', 'DESC']],
    where: {
      estateResgister: '已登记'
    }
  })
  if (registerEstate != null) {
    res.json({ state: 200, estate: registerEstate })
  } else {
    res.json({ state: 400 })
  }
})

// 获取所有未登记的房产
router.get('/getAllUnSaleEstate', function(req, res, next) {
  const unSale = models.estate
    .findAll({
      order: [['id', 'DESC']],
      where: {
        estateResgister: '未登记'
      }
    })
    .then(estate => {
      if (estate != null) {
        res.json({ state: 200, estate: estate })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 新增未登记房产
router.post('/addEstate', function(req, res, next) {
  // 新增之前判断是否有重复
  if (
    req.body.params.estateBuilds &&
    req.body.params.estateUnit &&
    req.body.params.estateFloor &&
    req.body.params.estatePlate
  ) {
    let estate = models.estate
      .findAll({
        where: {
          estateBuilds: req.body.params.estateBuilds,
          estateUnit: req.body.params.estateUnit,
          estateFloor: req.body.params.estateFloor,
          estatePlate: req.body.params.estatePlate
        }
      })
      .then(estate => {
        if (estate.length != 0) {
          res.json({ state: 401, message: '该房产信息已存在' })
        } else {
          const estate = models.estate.create(req.body.params).then(flag => {
            if (flag) {
              console.log(flag)
              res.json({ state: 200, message: '添加成功' })
            } else {
              res.json({ state: 400 })
            }
          })
        }
      })
  }
})

// 登记房产
router.post('/estateRegister', function(req, res, next) {
  if (req.body.params.estateOwnerCard && req.body.params.estateOwner) {
    let owner = models.owner
      .findOne({
        where: {
          ownerName: req.body.params.estateOwner,
          ownerCard: req.body.params.estateOwnerCard
        }
      })
      .then(owner => {
        if (owner === null) {
          console.log(owner)
          res.json({ state: 401, message: '业主不存在,请检查业主姓名与身份证' })
        } else {
          const estate = models.estate
            .update(req.body.params, {
              where: {
                id: req.body.params.id
              }
            })
            .then(register => {
              if (register != null) {
                const ownerUpdate = models.owner
                  .update(
                    { ownerMoveDate: req.body.params.ownerMoveDate },
                    {
                      where: {
                        ownerCard: req.body.params.estateOwnerCard,
                        ownerName: req.body.params.estateOwner
                      }
                    }
                  )
                  .then(owner => {
                    if (owner != null) {
                      res.json({ state: 200, message: '登记成功' })
                    } else {
                      res.json({ state: 400 })
                    }
                  })
              } else {
                res.json({ state: 400 })
              }
            })
        }
      })
  }
})

// 按条件查找未登记的房产信息
router.post('/searchEstateApplication', function(req, res, next) {
  console.log(req.body.params.houseInfo)
  let houseInfo = req.body.params.houseInfo
  if (!houseInfo.houseUnit) {
    houseInfo.houseUnit = ''
  }
  if (!houseInfo.houseFloor) {
    houseInfo.houseFloor = ''
  }
  if (!houseInfo.houseApart) {
    houseInfo.houseApart = ''
  }
  if (!houseInfo.houseBuilds) {
    houseInfo.houseBuilds = ''
  }
  let where = {
    estateBuilds: {
      [Op.like]: '%' + houseInfo.houseBuilds + '%'
    },
    estateUnit: {
      [Op.like]: '%' + houseInfo.houseUnit + '%'
    },
    estateFloor: {
      [Op.like]: '%' + houseInfo.houseFloor + '%'
    },
    estateApart: {
      [Op.like]: '%' + houseInfo.houseApart + '%'
    },
    estateResgister: '未登记'
  }
  const estate = models.estate
    .findAll({
      order: [['id', 'DESC']],
      where: where
    })
    .then(estates => {
      if (estates) {
        res.json({ state: 200, estates: estates })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 编辑未登记的房产信息
router.post('/modifyEstateApplication', function(req, res, next) {
  let estateInfo = req.body.params.estateInfo
  if (estateInfo) {
    let estate = models.estate
      .findOne({
        where: {
          estateBuilds: estateInfo.estateBuilds,
          estateUnit: estateInfo.estateUnit,
          estateFloor: estateInfo.estateFloor,
          estatePlate: estateInfo.estatePlate
        }
      })
      .then(estate => {
        if (estate != null) {
          if (estate.id === estateInfo.id) {
            let estate = models.estate
              .update(estateInfo, {
                where: {
                  id: estateInfo.id
                }
              })
              .then(flag => {
                if (flag) {
                  res.json({ state: 200, message: '修改成功' })
                } else {
                  res.json({ state: 400 })
                }
              })
          } else {
            res.json({ state: 401, message: '此房产信息重复，已存在' })
          }
        } else {
          let estate = models.estate
            .update(estateInfo, {
              where: {
                id: estateInfo.id
              }
            })
            .then(flag => {
              if (flag) {
                res.json({ state: 200, message: '修改成功' })
              } else {
                res.json({ state: 400 })
              }
            })
        }
      })
  }
})

// 删除单个房产信息
router.post('/deleteEstateApplication', function(req, res, next) {
  let estateId = req.body.params.estateId
  let estate = models.estate
    .destroy({
      where: {
        id: estateId
      }
    })
    .then(flag => {
      console.log(flag)
      if (flag != null) {
        res.json({ state: 200, message: '删除成功' })
      } else {
        res.json({ state: 400 })
      }
    })
})
// 批量删除房产信息
router.post('/deleteEstateApplicationList', function(req, res, next) {
  let estateList = req.body.params.estateList
  return new Promise((resolve, reject) => {
    if (!estateList) {
      reject(error)
    } else if (estateList.length != 0) {
      estateList.forEach(item => {
        let estate = models.estate.destroy({
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

// 解除已登记的房产信息
router.post('/reliveRegister', function(req, res, next) {
  let estateInfo = req.body.params.estateInfo
  let estateResgister = {
    estateResgister: '未登记',
    estateOwner: '',
    estateOwnerCard: '',
    ownerMoveDate: '',
    estateContent: ''
  }
  let estateUpdate = models.estate
    .update(estateResgister, {
      where: {
        id: estateInfo.id
      }
    })
    .then(flag => {
      if (flag != null) {
        res.json({ state: 200, message: '已解除绑定' })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 搜索已登记的房产信息
router.post('/searchRegisterApplication', function(req, res, next) {
  let searchInfo = req.body.params.searchInfo
  if (!searchInfo.estateBuilds) {
    searchInfo.estateBuilds = ''
  }
  if (!searchInfo.estateUnit) {
    searchInfo.estateUnit = ''
  }
  if (!searchInfo.estatePlate) {
    searchInfo.estatePlate = ''
  }
  if (!searchInfo.estateOwner) {
    searchInfo.estateOwner = ''
  }
  let where = {
    estateBuilds: {
      [Op.like]: '%' + searchInfo.estateBuilds + '%'
    },
    estateUnit: {
      [Op.like]: '%' + searchInfo.estateUnit + '%'
    },
    estatePlate: {
      [Op.like]: '%' + searchInfo.estatePlate + '%'
    },
    estateOwner: {
      [Op.like]: '%' + searchInfo.estateOwner + '%'
    },
    estateResgister: '已登记'
  }
  const estate = models.estate
    .findAll({
      order: [['id', 'DESC']],
      where: where
    })
    .then(estates => {
      if (estates != null) {
        res.json({ state: 200, estates: estates })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 获取所有房产信息
router.get('/getAllEstate', function(req, res, next) {
  const estateList = models.estate.findAll().then(estateList => {
    if (estateList != null) {
      res.json({ state: 200, estateList: estateList })
    } else {
      res.json({ state: 400 })
    }
  })
})

// 导出所有房产信息
router.get('/exportEstate', async function(req, res, next) {
  const estateList = await models.estate.findAll({
    where: {
      estateResgister: '已登记'
    }
  })
  let estateListJson = JSON.parse(JSON.stringify(estateList))
  let data = []
  let options = {
    '!cols': [
      { wch: 7 },
      { wch: 7 },
      { wch: 7 },
      { wch: 8 },
      { wch: 7 },
      { wch: 9 },
      { wch: 7 },
      { wch: 12 },
      { wch: 20 }
    ]
  }
  let title = [
    '楼宇',
    '单元',
    '楼层',
    '户型',
    '门牌',
    '面积(m²)',
    '业主',
    '迁入时间',
    '备注'
  ]
  data.push(title)

  estateListJson.forEach(item => {
    let arrInner = []
    arrInner.push(item.estateBuilds)
    arrInner.push(item.estateUnit)
    arrInner.push(item.estateFloor)
    arrInner.push(item.estateApart)
    arrInner.push(item.estatePlate)
    arrInner.push(item.estateArea)
    arrInner.push(item.estateOwner)
    arrInner.push(item.ownerMoveDate)
    arrInner.push(item.estateContent)
    data.push(arrInner)
  })
  writeXls(data, options, res)
})

// 勾选导出未登记房产
router.post('/exportEstateList', async function(req, res, next) {
  const exportList = req.body.params.exportList
  if (exportList.length === 0) {
    return
  }
  let data = []
  let options = {
    '!cols': [
      { wch: 7 },
      { wch: 7 },
      { wch: 7 },
      { wch: 8 },
      { wch: 7 },
      { wch: 9 },
      { wch: 7 },
      { wch: 12 },
      { wch: 20 }
    ]
  }
  let title = [
    '楼宇',
    '单元',
    '楼层',
    '户型',
    '门牌',
    '面积(m²)',
    '业主',
    '迁入时间',
    '备注'
  ]
  data.push(title)
  exportList.forEach(item => {
    let arrInner = []
    arrInner.push(item.estateBuilds)
    arrInner.push(item.estateUnit)
    arrInner.push(item.estateFloor)
    arrInner.push(item.estateApart)
    arrInner.push(item.estatePlate)
    arrInner.push(item.estateArea)
    arrInner.push(item.estateOwner)
    arrInner.push(item.ownerMoveDate)
    arrInner.push(item.estateContent)
    data.push(arrInner)
  })
  writeXls(data, options, res)
})

// 导出未登记房产
router.get('/exportUnRegisterEstateExcel', async function(req, res, next) {
  const estateList = await models.estate.findAll({
    where: {
      estateResgister: '未登记'
    }
  })
  let data = []
  let options = {
    '!cols': [
      { wch: 7 },
      { wch: 7 },
      { wch: 7 },
      { wch: 8 },
      { wch: 7 },
      { wch: 9 },
      { wch: 7 }
    ]
  }
  let title = ['楼宇', '单元', '楼层', '户型', '门牌', '面积(m²)', '装修']
  data.push(title)
  const estateListJson = JSON.parse(JSON.stringify(estateList))
  estateListJson.forEach(item => {
    let arrInner = []
    arrInner.push(item.estateBuilds)
    arrInner.push(item.estateUnit)
    arrInner.push(item.estateFloor)
    arrInner.push(item.estateApart)
    arrInner.push(item.estatePlate)
    arrInner.push(item.estateArea)
    arrInner.push(item.estateReno)
    data.push(arrInner)
  })
  writeXls(data, options, res)
})

// 批量导出未登房产
router.post('/exportUnRegisterEstateExcelList', async function(req, res, next) {
  const exportList = req.body.params.exportList
  if (exportList.length === 0) {
    return
  }
  let data = []
  let options = {
    '!cols': [
      { wch: 7 },
      { wch: 7 },
      { wch: 7 },
      { wch: 8 },
      { wch: 7 },
      { wch: 9 },
      { wch: 7 }
    ]
  }
  let title = ['楼宇', '单元', '楼层', '户型', '门牌', '面积(m²)', '装修']
  data.push(title)
  exportList.forEach(item => {
    let arrInner = []
    arrInner.push(item.estateBuilds)
    arrInner.push(item.estateUnit)
    arrInner.push(item.estateFloor)
    arrInner.push(item.estateApart)
    arrInner.push(item.estatePlate)
    arrInner.push(item.estateArea)
    arrInner.push(item.estateReno)
    data.push(arrInner)
  })
  writeXls(data, options, res)
})
module.exports = router
