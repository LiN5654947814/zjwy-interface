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
          res.json({ state: 401, message: '业主不存在' })
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
module.exports = router
