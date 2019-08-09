const { initSaveFile, writeJson } = require("../fs")
const path = require("path")
const funcs = require("./crawler")

let spiders = funcs.map(async func => {
  return await func()
})

let target = path.resolve(__dirname, "../data/result.json")
Promise.all(spiders).then(async res => {
  // 初始化json
  await initSaveFile(target)
  // 写入json
  async function write(array) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index]
      await writeJson(element, target)
    }
  }
  await write(res)
})
