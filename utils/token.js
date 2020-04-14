var crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ResModels = require("../model/resModels");

// 密钥
const secret = "secret";
var token = {
  createToken: function (data) {
    // Token 数据
    const payload = data;
    // 签发 Token
    const token = jwt.sign({ ...payload }, secret, { expiresIn: 24 * 3600 }); // exporesIn为过期时间，单位：ms/h/days/d  eg:1000, "2 days", "10h", "7d"
    return token;
  },
  checkToken: function (token, res, next) {
    // 验证 Token 把要验证的 Token 数据，还有签发这个 Token 的时候用的那个密钥告诉 verify 这个方法，在一个回调里面有两个参数，error 表示错误，decoded 是解码之后的 Token 数据。
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        if (error.name === "JsonWebTokenError") {
          res.json(new ResModels({ message: "无效的token", status: 403 }));
          return;
        }
        if (error.name === "TokenExpiredError") {
          res.json(new ResModels({ message: "token已过期", status: 403 }));
          return;
        }
      }
      next();
    });
  },
};
module.exports = exports = token;
