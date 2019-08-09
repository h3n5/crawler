const http = require("./axios")
const cheerio = require("cheerio")

function getHost(html) {
  return html.request._header
    .match(/Host:.*\b/)[0]
    .split(":")[1]
    .trim()
}

module.exports = [
  async function crawler_leetcode() {
    const url = "https://leetcode-cn.com/graphql"
    let form = {
      operationName: "communityRecommendation",
      variables: { nextToken: "" },
      query:
        "query communityRecommendation($nextToken: String) {\n  communityRecommendedItems(nextToken: $nextToken) {\n    nodes {\n      ... on QAQuestionNode {\n        ...qaQuestion\n        __typename\n      }\n      ... on QAAnswerNode {\n        ...qaAnswer\n        __typename\n      }\n      ... on ColumnArticleNode {\n        uuid\n        title\n        hitCount\n        upvoteCount\n        pinnedGlobally\n        pinned\n        articleSunk: sunk\n        createdAt\n        updatedAt\n        thumbnail\n        identifier\n        resourceType\n        articleType\n        subject {\n          title\n          slug\n          __typename\n        }\n        tags {\n          name\n          slug\n          nameTranslated\n          __typename\n        }\n        author {\n          username\n          profile {\n            userSlug\n            realName\n            userAvatar\n            __typename\n          }\n          __typename\n        }\n        reactedType\n        reactions {\n          count\n          reactionType\n          __typename\n        }\n        upvoted\n        isMyFavorite\n        topic {\n          id\n          commentCount\n          __typename\n        }\n        summary\n        isEditorsPick\n        byLeetcode\n        status\n        __typename\n      }\n      __typename\n    }\n    nextToken\n    __typename\n  }\n}\n\nfragment qaQuestion on QAQuestionNode {\n  uuid\n  slug\n  title\n  thumbnail\n  summary\n  content\n  sunk\n  pinned\n  pinnedGlobally\n  byLeetcode\n  subscribed\n  hitCount\n  numAnswers\n  numPeopleInvolved\n  numSubscribed\n  createdAt\n  updatedAt\n  status\n  identifier\n  resourceType\n  articleType\n  tags {\n    name\n    nameTranslated\n    slug\n    __typename\n  }\n  subject {\n    slug\n    title\n    __typename\n  }\n  author {\n    username\n    profile {\n      userSlug\n      userAvatar\n      realName\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment qaAnswer on QAAnswerNode {\n  uuid\n  slug\n  upvoteCount\n  createdAt\n  thumbnail\n  summary\n  status\n  identifier\n  resourceType\n  content\n  isEditorsPick\n  articleType\n  sunk\n  pinned\n  author {\n    username\n    profile {\n      userSlug\n      realName\n      userAvatar\n      __typename\n    }\n    __typename\n  }\n  reactedType\n  reactions {\n    count\n    reactionType\n    __typename\n  }\n  upvoted\n  isMyFavorite\n  parent {\n    uuid\n    title\n    __typename\n  }\n  topic {\n    id\n    commentCount\n    __typename\n  }\n  __typename\n}\n"
    }
    let html = await http.post(url, form, {
      "content-type": "application/json"
    })
    let res = []

    html.data.data.communityRecommendedItems.nodes.forEach(v => {
      let url = `https://leetcode-cn.com/circle/discuss/` + v.uuid
      let name = v.title || v.parent.title
      let type = "leetcode"
      res.push({ url, name, type })
    })

    return res
  },
  async function crawler_cnode() {
    const url = "https://cnodejs.org/"
    let html = await http.get(url)
    let res = []
    let host = getHost(html)
    if (html.data) {
      let $ = cheerio.load(html.data)
      $("#topic_list .cell").each(function(i, e) {
        let temp = $(this).find("a.topic_title")
        let url = host + temp.attr("href")
        let name = temp.text().trim()
        let type = "cnode"
        res.push({ url, name, type })
      })
    }
    return res
  },
  async function crawler_juejin() {
    const url = "https://web-api.juejin.im/query"
    let html = await http.post(
      url,
      {
        extensions: { query: { id: "21207e9ddb1de777adeaca7a2fb38030" } },
        variables: { first: 20, after: "", order: "POPULAR" }
      },
      {
        headers: {
          "X-Agent": "Juejin/Web"
        }
      }
    )

    let info = html.data.data.articleFeed.items

    let res = []

    let { edges, pageInfo } = info

    edges.forEach(temp => {
      let url = temp.node.originalUrl
      let name = temp.node.title
      let type = "juejin"
      res.push({ url, name, type })
    })
    return res
  },
  async function crawler_v2ex() {
    const url = "https://www.v2ex.com/?tab=hot"
    let html = await http.get(url, {
      headers: {
        authority: "www.v2ex.com",
        referer: "https://www.v2ex.com/"
      }
    })
    let host = getHost(html)
    let $ = cheerio.load(html.data)
    let res = []
    $(".box .item").each(function(i, e) {
      let temp = $(this).find(".item_title > a")
      let url = host + temp.attr("href")
      let name = temp.text()
      let type = "v2ex"
      res.push({ url, name, type })
    })
    return res
  },
  async function crawler_weibo() {
    const url = "https://s.weibo.com/top/summary?cate=realtimehot"
    let html = await http.get(url)

    let host = getHost(html)
    let res = []
    if (html.data) {
      let $ = cheerio.load(html.data)
      $(".data tr .td-02").each(function(i, e) {
        let temp = $(this).children("a")
        let url = host + temp.attr("href")
        let name = temp.text()
        let type = "weibo"
        res.push({ url, name, type })
      })
    }
    return res
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
    let res = []
    if (data) {
      data.forEach(v => {
        let url = v.target.link.url
        let name = v.target.title_area.text
        let type = "zhihu"
        res.push({ url, name, type })
      })
    }
    return res
  },
  async function crawler_tieba() {
    const url = "http://tieba.baidu.com/hottopic/browse/topicList"
    let html = await http.get(url)

    let data = html.data.data.bang_topic.topic_list
    let res = []
    if (data) {
      data.forEach(v => {
        let url = v.topic_url.replace("&amp;", "&")
        let name = v.topic_desc.replace(/查看详情(&gt;)+/g, "")
        let type = "tieba"
        res.push({ url, name, type })
      })
    }
    return res
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
    let res = []
    $(".article .channel-item").each(function(i, e) {
      let temp = $(this).find(".bd h3 a")
      let url = temp.attr("href")
      let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi
      let name = temp.text().replace(reg, "")
      let type = "douban"
      res.push({ url, name, type })
    })
    return res
  },
  async function crawler_tianya() {
    const url = "http://bbs.tianya.cn/hotArticle.jsp"
    let html = await http.get(url, {
      headers: {
        Host: "bbs.tianya.cn"
      }
    })
    let host = getHost(html)
    let $ = cheerio.load(html.data)
    let res = []
    $("#main .mt5 table tbody td.td-title").each(function(i, e) {
      let temp = $(this).find("a")
      let url = host + temp.attr("href")
      let name = temp.text()
      let type = "tianya"
      res.push({ url, name, type })
    })
    return res
  }
]
