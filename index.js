// 引入Express模塊
const express = require('express')
const Papa = require('papaparse')
const os = require('os')
const cors = require('cors')
// 創建一個Express應用
const app = express()
// 使用cors中間件，這將允許所有跨源請求
app.use(cors())
// 定義一個端口號
const port = 3000
const interfaces = os.networkInterfaces()
let serverIP = ''
for (let iface in interfaces) {
  for (let i = 0; i < interfaces[iface].length; i++) {
    let alias = interfaces[iface][i]
    if ('IPv4' === alias.family && !alias.internal) {
      serverIP = alias.address
    }
  }
}
// 創建一個GET路由
app.get('/api/friendly_store', async (req, res) => {
  const csvUrl =
    'https://data.taipei/api/dataset/d807396c-e41f-4005-be42-0160280783a1/resource/5a5b36e0-f870-4b7f-8378-c91ac5f57941/download'
  const response = await fetch(csvUrl)
  const csvText = await response.text()
  const parseCSV = async (csvText) => {
    let json = null
    Papa.parse(csvText, {
      header: true, // 假設你的 CSV 檔案有標題行
      complete: (result) => {
        json = result.data
      },
    })
    return json
  }
  const data = await parseCSV(csvText)
  // 返回JSON格式的響應數據
  res.json(data)
})
// 啟動伺服器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
  console.log(`IP ${serverIP}`)
})
