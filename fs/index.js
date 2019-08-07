const fs = require("fs")
const { saveFileName } = require("../config")

const initData = JSON.stringify({
  data: [],
  total: 0
})
function initSaveFile(target) {
  try {
    fs.writeSync(target, initData)
  } catch (error) {
    fs.writeFileSync(target, initData)
  }
}

function writeJson(params, target) {
  fs.readFile(target, "utf-8", function(err, str) {
    if (err) {
      if (err.errno === -4058) {
        initSaveFile(target)
      } else {
        return console.error(err)
      }
    }

    let data = JSON.parse(str) //将字符串转换为json对象

    data.data = data.data.concat(params) //将传来的对象push进数组对象中

    data.total += params.length //定义一下总条数，为以后的分页打基础

    var str = JSON.stringify(data) //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中

    fs.writeFile(target, str, function(err) {
      if (err) return console.error(err)
      console.log("写入成功" + Date())
    })
  })
}

module.exports = {
  writeJson,
  initSaveFile
}
