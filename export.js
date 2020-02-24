const nodeExcel = require('excel-export')

class exportData {
  constructor(data) {
    let conf = {}
    conf.name = '业主表'
    let allData = new Array()
    for (let i = 0; i < data.length; i++) {
      let arr = new Array()
      arr.push(data[i].ownerName)
      arr.push(data[i].ownerSex)
      arr.push(data[i].ownerPhone)
      console.log(data[i])
      // arr.push(
      //   data[i].estates[0].estateBuilds +
      //     '-' +
      //     data[i].estates[0].estateUnit +
      //     '-' +
      //     data[i].estates[0].estatePlate
      // )
      // arr.push(data[i].estates.length)
      // arr.push(data[i].parkings.length)
      // arr.push(data[i].estates[0].ownerMoveDate)
    }
    conf.cols = [
      {
        caption: '业主姓名',
        type: 'string'
      },
      {
        caption: '性别',
        type: 'string'
      },
      {
        caption: '联系手机号',
        type: 'string'
      },
      {
        caption: '所在楼宇单元',
        type: 'string'
      },
      {
        caption: '房产数',
        type: 'string'
      },
      {
        caption: '车位拥有数',
        type: 'string'
      },
      {
        caption: '迁入时间',
        type: 'string'
      }
    ]
    conf.rows = allData
    let result = nodeExcel.execute(conf)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats')
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'Report.xlsx'
    )
    res.json({ state: 200, result: result, binary: 'binary' })
  }
}

module.exports = exportData
