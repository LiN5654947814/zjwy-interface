const express = require('express')
const router = express.Router()
const models = require('../models')
const Op = models.Sequelize.Op

// 获取所有投诉信息
router.get('/getAllComplaint', function(req, res, next) {
  const complaintList = models.complaint
    .findAll({
      include: [models.estate]
    })
    .then(complaintList => {
      if (complaintList != null) {
        res.json({ state: 200, complaintList: complaintList })
      } else {
        res.json({ state: 400 })
      }
    })
})

module.exports = router
