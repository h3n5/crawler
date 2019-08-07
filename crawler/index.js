const http = require("../axios")
const cheerio = require("cheerio")
const sql = require("../db.js")

let func = [
  async function crawler_weibo() {
    const url = "https://s.weibo.com/top/summary?cate=realtimehot"
    let html = await http.get(url)

    let host = html.request._header
      .match(/Host:.*\b/)[0]
      .split(":")[1]
      .trim()
    if (html.data) {
      let $ = cheerio.load(html.data)
      $(".list_a li").each(function(i, e) {
        let temp = $(this).children("a")
        let url = host + temp.attr("href")
        let name = temp.children("span").text()
        sql.insertSearch([url, name])
      })
      sql.selectSearch()
    }
  },
  async function crawler_zhihu() {
    const url = "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true"
    let html = await http.get(url, {
      headers: {
        path: "/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true",
        "x-api-version": "3.0.76",
        "x-requested-with": "fetch"
      }
    })

    let data = html.data.data
    if (data) {
      data.forEach(v => {
        let url = v.target.link.url
        let name = v.target.excerpt_area.text.slice(0, 255)
        sql.insertSearch([url, name])
      })
      sql.selectSearch()
    }
  },
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
    $(".box .item").each(function(i, e) {
      let temp = $(this).find(".item_title > a")
      let url = host + temp.attr("href")
      let name = temp.text()
      sql.insertSearch([url, name])
    })
    sql.selectSearch()
  },
  async function crawler_tieba() {
    const url = "http://tieba.baidu.com/hottopic/browse/topicList"
    let html = await http.get(url)

    let data = html.data.data.bang_topic.topic_list
    if (data) {
      data.forEach(v => {
        let url = v.topic_url.replace("&amp;", "&")
        let name = v.topic_desc
        sql.insertSearch([url, name])
      })
      sql.selectSearch()
    }
  },
  async function crawler_douban() {
    const url = "https://www.douban.com/group/explore"
    let html = await http.get(url, {
      headers: {
        Host: "www.douban.com",
        Referer: "https://www.douban.com/group/explore"
      }
    })

    let $ = cheerio.load(html.data)
    $(".article .channel-item").each(function(i, e) {
      let temp = $(this).find(".bd h3 a")
      let url = temp.attr("href")
      let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi
      let name = temp.text().replace(reg, "")
      sql.insertSearch([url, name])
    })
    sql.selectSearch()
  },
  async function crawler_tianya() {
    const url = "http://bbs.tianya.cn/hotArticle.jsp"
    let html = await http.get(url, {
      headers: {
        Host: "bbs.tianya.cn"
      }
    })
    let host = html.request._header
      .match(/Host:.*\b/)[0]
      .split(":")[1]
      .trim()
    let $ = cheerio.load(html.data)
    $("#main .mt5 table tbody td.td-title").each(function(i, e) {
      let temp = $(this).find("a")
      let url = host + temp.attr("href")
      let name = temp.text()
      sql.insertSearch([url, name])
    })
    sql.selectSearch()
  }
]
moudle.export = func