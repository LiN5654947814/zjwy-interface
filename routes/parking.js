const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op

// 获取所有车位信息
router.get('/getAllParking', async function(req, res, next) {
  const parkingList = await models.parking
    .findAll({
      where: {
        parkingType: '公有'
      }
    })
    .then(parkingList => {
      if (parkingList != null) {
        res.json({ state: 200, parkingList: parkingList })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 登记车位
router.post('/parkingRegister', async function(req, res, next) {
  let parkingInfo = req.body.params.parkingInfo
  console.log(parkingInfo)
  // 查询此业主是否存在
  if (parkingInfo.parkingOwner && parkingInfo.parkingOwnerCard) {
    let owner = await models.owner
      .findOne({
        where: {
          ownerName: parkingInfo.parkingOwner,
          ownerCard: parkingInfo.parkingOwnerCard
        }
      })
      .then(async owner => {
        console.log(owner)
        if (owner != null) {
          let register = await models.parking
            .update(parkingInfo, {
              where: {
                id: parkingInfo.id
              }
            })
            .then(register => {
              if (register != null) {
                res.json({ state: 200, message: '登记成功' })
              } else {
                res.json({ state: 400 })
              }
            })
        } else {
          res.json({
            state: 401,
            message: '业主不存在或身份证与业主输入错误，请检查'
          })
        }
      })
  }
})

// 新增车位信息
router.post('/addParking', async function(req, res, next) {
  let parkingInfo = req.body.params.parkingInfo
  parkingInfo.parkingStartTime = ''
  parkingInfo.parkingEndTime = ''
  parkingInfo.parkingOwner = ''
  console.log(parkingInfo)
  if (parkingInfo) {
    let pakring = await models.parking
      .findOne({
        where: {
          parkingNum: parkingInfo.parkingNum
        }
      })
      .then(async parking => {
        if (parking != null) {
          res.json({ state: 401, message: '该车位编号已存在' })
        } else {
          const parking = await models.parking
            .create(parkingInfo)
            .then(parking => {
              if (parking != null) {
                res.json({ state: 200, message: '新增成功' })
              }
            })
        }
      })
  }
})

// 搜索公有车位信息
router.post('/searchParking', async function(req, res, next) {
  let keyWrods = req.body.params.keyWrods
  let where = {
    parkingNum: {
      [Op.like]: '%' + keyWrods + '%'
    }
  }
  if (keyWrods == '') {
    const parking = await models.parking.findAll().then(parkingList => {
      if (parkingList != null) {
        res.json({ state: 200, parkingList: parkingList })
      }
    })
  } else {
    const parking = await models.parking
      .findAll({
        order: [['id', 'DESC']],
        where: where
      })
      .then(parkingList => {
        if (parkingList != null) {
          res.json({ state: 200, parkingList: parkingList })
        } else {
          res.json({ state: 400 })
        }
      })
  }
})
// 删除公有车位
router.post('/deleteParking', async function(req, res, next) {
  let parkingInfo = req.body.params.parkingInfo
  const deleteParking = await models.parking
    .destroy({
      where: {
        id: parkingInfo.id
      }
    })
    .then(parking => {
      if (parking != null) {
        res.json({ state: 200, message: '删除成功' })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 批量删除公有车位
router.post('/deleteParkingList', function(req, res, next) {
  let parkingList = req.body.params.parkingList
  return new Promise(async (resolve, reject) => {
    if (!parkingList) {
      reject(error)
    } else if (parkingList.length != 0) {
      await parkingList.forEach(item => {
        let parking = models.parking.destroy({
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

// 渲染私有车位
router.get('/getAllRegisterParking', async function(req, res, next) {
  const parkingList = await models.parking
    .findAll({
      where: {
        parkingType: '私有'
      }
    })
    .then(parkingList => {
      if (parkingList != null) {
        res.json({ state: 200, parkingList: parkingList })
      } else {
        res.json({ state: 400 })
      }
    })
})

// 解除车位登记信息
router.post('/reliveParking', async function(req, res, next) {
  let parkingInfo = req.body.params.parkingInfo
  let parking = {
    parkingType: '公有',
    parkingStartTime: '',
    parkingEndTime: '',
    parkingOwner: '',
    parkingOwnerCard: ''
  }
  const reliveParking = await models.parking
    .update(parking, {
      where: {
        id: parkingInfo.id
      }
    })
    .then(parking => {
      if (parking != null) {
        res.json({ state: 200, message: '该业主与车位信息已解绑' })
      } else {
        res.json({ state: 400 })
      }
    })
  console.log(req.body.params)
  res.json({ state: 200 })
})

// 编辑已登记的车位信息
router.post('/modifyRegisterParking', async function(req, res, next) {
  console.log(req.body.params)
  let parkingInfo = req.body.params.parkingInfo
})

// 搜索私有车位信息
router.post('/searchRegisterParking', async function(req, res, next) {
  let keyWrods = req.body.params.parkingSearch
  if (!keyWrods.parkingNum) {
    keyWrods.parkingNum = ''
  }
  if (!keyWrods.payDate) {
    keyWrods.payDate = ''
  }
  if (!keyWrods.parkingOwner) {
    keyWrods.parkingOwner = ''
  }
  let where = {
    parkingNum: {
      [Op.like]: '%' + keyWrods.parkingNum + '%'
    },
    parkingStartTime: {
      [Op.between]: [keyWrods.payDate[0], keyWrods.payDate[1]]
    },
    parkingEndTime: {
      [Op.between]: [keyWrods.payDate[0], keyWrods.payDate[1]]
    },
    parkingOwner: {
      [Op.like]: '%' + keyWrods.parkingOwner + '%'
    },
    parkingType: '私有'
  }
  const parking = await models.parking
    .findAll({
      where: where,
      order: [['id', 'DESC']]
    })
    .then(parkingList => {
      console.log(parkingList)
      if (parkingList != null) {
        res.json({ state: 200, parkingList: parkingList })
      } else {
        res.json({ state: 400 })
      }
    })
})

module.exports = router
