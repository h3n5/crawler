const fs = require("fs")

const initData = JSON.stringify({
  data: [],
  total: 0
})
function initSaveFile(target) {
  return new Promise(reslove => {
    console.log("初始化文件")
    try {
      fs.writeSync(target, initData)
    } catch (error) {
      fs.writeFileSync(target, initData)
    } finally {
      reslove()
    }
  })
}

function writeJson(params, target) {
  return new Promise(reslove => {
    fs.readFile(target, "utf-8", function(err, str) {
      if (err) {
        if (err.errno === -4058) {
          initSaveFile(target)
        } else {
          return console.error(err)
        }
      }

      let data = JSON.parse(str)

      data.data = data.data.concat(params)

      data.total += params.length

      var str = JSON.stringify(data)

      fs.writeFile(target, str, function(err) {
        if (err) return console.error(err)
        reslove()
        console.log(`写入数据${params.length}条`)
      })
    })
  })
}

module.exports = {
  writeJson,
  initSaveFile
}
