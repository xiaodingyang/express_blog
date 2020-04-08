const mysql = require("mysql");
const { MYSQL_CONFIG } = require("../config/db");

// 创建连接对象
const connection = mysql.createConnection(MYSQL_CONFIG);

// 开始连接
connection.connect();

// 统一 执行sql 的函数

function exec(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

module.exports = {
  exec,
};
