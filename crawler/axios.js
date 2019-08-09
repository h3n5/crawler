const Axios = require("axios")

const http = Axios.create({
  timeout: 120000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36"
  }
  // proxy: {
  //   host: "127.0.0.1",
  //   port: 8888
  // }
})

http.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log("???????????", error)
    return Promise.reject(error)
  }
)
http.interceptors.response.use(
  config => {
    return config
  },
  error => {
    console.log("???????????", error)
    return Promise.reject(error)
  }
)
module.exports = http
