/* mysql 环境配置 */
const env = process.env.NODE_ENV; // 环境参数

let MYSQL_CONFIG;
let REDIS_CONFIG;
let CRS;
let PORT;
if (env === "development") {
  PORT = 8001;
  MYSQL_CONFIG = {
    host: "127.0.0.1",
    user: "root",
    password: "2691716451Yang",
    port: "3306",
    database: "myBlog",
  };
  // reids 配置
  REDIS_CONFIG = {
    port: 6379,
    host: "127.0.0.1",
  };
} else {
  PORT = 8000;
  MYSQL_CONFIG = {
    host: "118.25.22.74",
    user: "root",
    password: "2691716451Yang",
    port: "3306",
    database: "myBlog",
  };
  // reids 配置
  REDIS_CONFIG = {
    port: 6379,
    host: "127.0.0.1",
  };
}
module.exports = {
  MYSQL_CONFIG,
  REDIS_CONFIG,
  PORT,
};
