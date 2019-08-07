const http = require("http")
const fs = require("fs")
const path = require("path")
const proxy = http.createServer(function(req, res) {
  req.setEncoding("utf-8")
  res.writeHead(200, {
    "Cache-control": "max-age=31536000",
    "Access-Control-Allow-Origin": "*"
  })
  res.end(fs.readFileSync(path.resolve("./data/result.json")))
})
proxy.on("error", e => {
  console.log("出错了" + e)
})
proxy.listen(4444)
