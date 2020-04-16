const { checkToken } = require("../utils/token");

module.exports = (req, res, next) => {
  const notCheckApi = ["/api/user/captcha", "/api/user/login"]; // token白名单（无需token验证的api）
  const isNext = notCheckApi.find((item) => item === req.url);
  if (isNext) {
    next();
    return;
  }
  // get方式不需要Token验证
  if (req.method !== "GET") {
    checkToken(req.headers.authorization, res, next);
    return;
  }
  next();
};
