const puppeteer = require("puppeteer")
const options = {
  headless: false,
  defaultViewport: {
    width: 1200,
    height: 1200
  }
}
puppeteer.launch(options).then(async browser => {
  const page = await browser.newPage()
  const target = "https://s.weibo.com/top/summary?cate=realtimehot"
  await page.goto(target)

  await page.focus(".search-input > input")

  await page.keyboard.type("Hello World!", { delay: 100 })

  await page.click(".searchbox .s-btn-b")
})
