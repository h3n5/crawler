const http = require("./axios")
const cheerio = require("cheerio")
const { writeJson, initSaveFile } = require("./fs")
var cronJob = require("cron").CronJob
const path = require("path")
async function crawler_v2ex() {
  const url = "https://www.v2ex.com/?tab=hot"
  let html = await http.get(url, {
    headers: {
      authority: "www.v2ex.com",
      referer: "https://www.v2ex.com/"
    }
  })
  let host = html.request._header
    .match(/Host:.*\b/)[0]
    .split(":")[1]
    .trim()
  let $ = cheerio.load(html.data)
  let res = []
  $(".box .item").each(function(i, e) {
    let temp = $(this).find(".item_title > a")
    let url = host + temp.attr("href")
    let name = temp.text()
    let type = "v2ex"
    res.push({ url, name, type })
  })
  initSaveFile(path.resolve("./data/result.json"))
  writeJson(res, path.resolve("./data/result.json"))
}
crawler_v2ex()
//每隔30秒执行一次，会在0秒和30秒处执行
// new cronJob("* */1 * * * *", crawler_v2ex, null, true, "Asia/Chongqing")
