var mysql = require("mysql")

var option = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "puppeteer"
}
var pool = mysql.createPool(option)

pool.query("SELECT * from goods", function(error, results, fields) {
  if (error) throw error
  console.log("The solution is: ", results)
})

module.exports = {
  insertSearch: function insertSearch(data) {
    let sql = "INSERT INTO search (url,name) VALUES(?,?)"
    pool.query(sql, data, function(error, results, fields) {
      if (error) throw error
      // console.log("The solution is: ", results)
    })
  },
  selectSearch: function selectSearch(data) {
    let sql = "select * from search"
    pool.query(sql, function(error, results, fields) {
      if (error) throw error
      console.log("The solution is: ", results)
    })
  }
}
