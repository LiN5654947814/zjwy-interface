const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op

// 获取所有车位信息
router.get('/getAllParking', async function(req, res, next) {
  const parkingList = await models.parking.findAll().then(parkingList => {
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
module.exports = router
