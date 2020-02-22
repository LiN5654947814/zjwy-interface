const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op

// 获取所有车位信息
router.get('/getAllParking', function(req, res, next) {
  const parkingList = models.parking
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
router.post('/parkingRegister', function(req, res, next) {
  let parkingInfo = req.body.params.parkingInfo
  console.log(parkingInfo)
  // 查询此业主是否存在
  if (parkingInfo.parkingOwner && parkingInfo.parkingOwnerCard) {
    let owner = models.owner
      .findOne({
        where: {
          ownerName: parkingInfo.parkingOwner,
          ownerCard: parkingInfo.parkingOwnerCard
        }
      })
      .then(owner => {
        console.log(owner)
        if (owner != null) {
          let register = models.parking
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
router.post('/addParking', function(req, res, next) {
  let parkingInfo = req.body.params.parkingInfo
  parkingInfo.parkingStartTime = ''
  parkingInfo.parkingEndTime = ''
  parkingInfo.parkingOwner = ''
  console.log(parkingInfo)
  if (parkingInfo) {
    let pakring = models.parking
      .findOne({
        where: {
          parkingNum: parkingInfo.parkingNum
        }
      })
      .then(parking => {
        if (parking != null) {
          res.json({ state: 401, message: '该车位编号已存在' })
        } else {
          const parking = models.parking.create(parkingInfo).then(parking => {
            if (parking != null) {
              res.json({ state: 200, message: '新增成功' })
            }
          })
        }
      })
  }
})

// 搜索公有车位信息
router.post('/searchParking', function(req, res, next) {
  let keyWrods = req.body.params.keyWrods
  let where = {
    parkingNum: {
      [Op.like]: '%' + keyWrods + '%'
    }
  }
  if (keyWrods === '') {
    console.log(1111111111)
    const parking = models.parking
      .findAll({
        where: {
          parkingType: '公有'
        }
      })
      .then(parkingList => {
        if (parkingList != null) {
          res.json({ state: 200, parkingList: parkingList })
        }
      })
  } else {
    const parking = models.parking
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
router.post('/deleteParking', function(req, res, next) {
  let parkingInfo = req.body.params.parkingInfo
  const deleteParking = models.parking
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
  return new Promise((resolve, reject) => {
    if (!parkingList) {
      reject(error)
    } else if (parkingList.length != 0) {
      parkingList.forEach(item => {
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
router.get('/getAllRegisterParking', function(req, res, next) {
  const parkingList = models.parking
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
router.post('/reliveParking', function(req, res, next) {
  let parkingInfo = req.body.params.parkingInfo
  let parking = {
    parkingType: '公有',
    parkingStartTime: '',
    parkingEndTime: '',
    parkingOwner: '',
    parkingOwnerCard: ''
  }
  const reliveParking = models.parking
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
router.post('/searchRegisterParking', function(req, res, next) {
  let keyWrods = req.body.params.parkingSearch
  if (!keyWrods.parkingNum) {
    keyWrods.parkingNum = ''
  }
  if (!keyWrods.parkingStartTime) {
    keyWrods.parkingStartTime = ''
  }
  if (!keyWrods.parkingOwner) {
    keyWrods.parkingOwner = ''
  }
  let where = {
    parkingNum: {
      [Op.like]: '%' + keyWrods.parkingNum + '%'
    },
    parkingStartTime: {
      [Op.gte]: keyWrods.parkingStartTime
    },
    parkingOwner: {
      [Op.like]: '%' + keyWrods.parkingOwner + '%'
    },
    parkingType: '私有'
  }
  console.log(keyWrods)
  const parking = models.parking
    .findAll({
      order: [['id', 'asc']],
      where: where
    })
    .then(parkingList => {
      if (parkingList != null) {
        res.json({ state: 200, parkingList: parkingList })
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
