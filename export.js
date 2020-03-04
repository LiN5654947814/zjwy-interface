const xlsx = require('node-xlsx')
const path = require('path')
async function writeXls(datas, options, res) {
  // 通过插件生成excel的二进制
  let buffers = await xlsx.build(
    [
      {
        name: 'sheet1',
        data: datas
      }
    ],
    options
  )
  let filename = new Date().getTime() + '.xlsx'
  const filePath = path.resolve(__dirname, '../excel', filename)
  // fs.writeFileSync(filePath, buffers, { encoding: 'buffer' })
  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader('Content-Disposition', 'attachment; filename=' + filename)
  // 返回文件流信息
  res.status(200).end(buffers, 'buffer')
}

module.exports = writeXls
