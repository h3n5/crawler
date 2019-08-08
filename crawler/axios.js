const Axios = require("axios")

const http = Axios.create({
  timeout: 120000,
  headers: {}
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
    return Promise.reject(error)
  }
)

module.exports = http
