const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op

// 获取所有登记的房产
router.get('/getAllRegisterEstate', async function(req, res, next) {
  const registerEstate = await models.estate
    .findAll({
      order: [['id', 'DESC']],
      where: {
        estateResgister: '已登记'
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

// 获取所有未登记的房产
router.get('/getAllUnSaleEstate', async function(req, res, next) {
  const unSale = await models.estate
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
router.post('/addEstate', async function(req, res, next) {
  // 新增之前判断是否有重复
  if (
    req.body.params.estateBuilds &&
    req.body.params.estateUnit &&
    req.body.params.estateFloor &&
    req.body.params.estatePlate
  ) {
    let estate = await models.estate
      .findAll({
        where: {
          estateBuilds: req.body.params.estateBuilds,
          estateUnit: req.body.params.estateUnit,
          estateFloor: req.body.params.estateFloor,
          estatePlate: req.body.params.estatePlate
        }
      })
      .then(async estate => {
        if (estate.length != 0) {
          res.json({ state: 401, message: '该房产信息已存在' })
        } else {
          const estate = await models.estate
            .create(req.body.params)
            .then(flag => {
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
router.post('/estateRegister', async function(req, res, next) {
  if (req.body.params.estateOwnerCard && req.body.params.estateOwner) {
    let owner = await models.owner
      .findOne({
        where: {
          ownerName: req.body.params.estateOwner,
          ownerCard: req.body.params.estateOwnerCard
        }
      })
      .then(async owner => {
        if (owner === null) {
          console.log(owner)
          res.json({ state: 401, message: '业主不存在,请检查业主姓名与身份证' })
        } else {
          const estate = await models.estate
            .update(req.body.params, {
              where: {
                id: req.body.params.id
              }
            })
            .then(register => {
              if (register) {
                res.json({ state: 200, message: '登记成功' })
              } else {
                res.json({ state: 400 })
              }
            })
        }
      })
  }
})

// 按条件查找未登记的房产信息
router.post('/searchEstateApplication', async function(req, res, next) {
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
  const estate = await models.estate
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
router.post('/modifyEstateApplication', async function(req, res, next) {
  let estateInfo = req.body.params.estateInfo
  if (estateInfo) {
    let estate = await models.estate
      .findOne({
        where: {
          estateBuilds: estateInfo.estateBuilds,
          estateUnit: estateInfo.estateUnit,
          estateFloor: estateInfo.estateFloor,
          estatePlate: estateInfo.estatePlate
        }
      })
      .then(async estate => {
        if (estate != null) {
          if (estate.id === estateInfo.id) {
            let estate = await models.estate
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
          let estate = await models.estate
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
router.post('/deleteEstateApplication', async function(req, res, next) {
  let estateId = req.body.params.estateId
  let estate = await models.estate
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
  return new Promise(async (resolve, reject) => {
    if (!estateList) {
      reject(error)
    } else if (estateList.length != 0) {
      await estateList.forEach(item => {
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
router.post('/reliveRegister', async function(req, res, next) {
  let estateInfo = req.body.params.estateInfo
  let estateResgister = {
    estateResgister: '未登记',
    estateOwner: '',
    estateOwnerCard: '',
    ownerMoveDate: '',
    estateContent: ''
  }
  let estateUpdate = await models.estate
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
router.post('/searchRegisterApplication', async function(req, res, next) {
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
  const estate = await models.estate
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
module.exports = router
