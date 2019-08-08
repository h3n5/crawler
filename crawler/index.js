const { initSaveFile, writeJson } = require("../fs")
const path = require("path")
const funcs = require("./crawler")

let spiders = funcs.map(async func => {
  return await func()
})

Promise.all(spiders).then(res => {
  // 初始化json
  initSaveFile(path.resolve(__dirname, "../data/result.json")).then(async () => {
    // 写入json
    async function write(array) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        await writeJson(element, path.resolve(__dirname, "../data/result.json"))
      }
    }
    write(res)
  })
})
