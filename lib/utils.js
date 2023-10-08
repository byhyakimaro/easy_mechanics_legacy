const mysql = require("mysql")

class utils {
  constructor() {
    this.connection = mysql.createPool({
      "host": "localhost",
      "user": "root",
      "password": ""
    });
    this.debug = true
    this.connected = false
  }

  connect(database) {
    return new Promise((resolve, reject) => {
      this.connection.getConnection((err, data) => {
        if (err) return reject(err)
        data.query(`CREATE DATABASE IF NOT EXISTS ${database}`)
        data.release();
        this.connection = mysql.createPool({
          "host": "localhost",
          "user": "root",
          "password": "",
          "database": database
        })
        this.connected = data
        resolve(data)
      })
    })
  }

  query(...string) {
    return new Promise((resolve, reject) => {
      this.connection.query(...string, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }
}

module.exports = utils
