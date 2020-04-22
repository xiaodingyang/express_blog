const { checkToken } = require("../utils/token");

module.exports = (req, res, next) => {
  const notCheckApi = [
    "/api/user/captcha",
    "/api/user/login",
    "/api/blog/upload",
  ]; // token白名单（无需token验证的api）
  const isNext = notCheckApi.find((item) => req.url.includes(item));
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
