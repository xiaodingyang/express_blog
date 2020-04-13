var express = require("express");
var router = express.Router();
const svgCaptcha = require("svg-captcha");
const resModels = require("../model/resModels");
const {
  login,
  getUserInfo,
  updateUser,
  newUser,
  deleteUser,
  isRepeat,
} = require("../control/user");
const xss = require("xss");

router.post("/login", function (req, res, next) {
  const identifying = req.body.identifying;
  // if (!(req.body.username && req.body.password && identifying)) {
  if (!(req.body.username && req.body.password)) {
    res.json(
      new resModels({ data: [], message: "用户名或密码错误！", status: 403 })
    );
    return;
  }
  login(req.body.username, req.body.password).then((data) => {
    req.body.username = xss(req.body.username);
    req.body.password = xss(req.body.password);

    if (data && data.username) {
      if (identifying === req.session.captcha) {
        req.session.userId = data.id;
        req.session.username = data.username;
        req.session.realname = data.realname;
        req.session.auth = data.auth;

        // 向客户端设置一个Cookie
        const userInfo = {
          id: req.session.id,
          username: req.session.username,
          realname: req.session.realname,
          auth: req.session.auth,
        };
        res.cookie("userInfo", JSON.stringify(userInfo));
        res.json(
          new resModels({ data: userInfo, message: "登录成功！", status: 200 })
        );
        return;
      } else {
        res.json(new resModels({ message: "验证码错误！", status: 2 }));
        return;
      }
    }
    res.json(
      new resModels({ data: [], message: "用户名或密码错误！", status: 403 })
    );
  });
});
/* 验证码 */
router.get("/captcha", function (req, res, next) {
  const cap = svgCaptcha.create({
    // 翻转颜色
    inverse: false,
    // 字体大小
    fontSize: 36,
    // 噪声线条数
    noise: 3,
    // 宽度
    width: 80,
    // 高度
    height: 30,
  });
  req.session.captcha = cap.text.toLowerCase(); // session 存储验证码数值 忽略大小写
  res.type("image/svg+xml"); // 响应的类型
  if (cap.data)
    res.json(new resModels({ data: cap.data, status: 200, message: "OK!" }));
  else
    res.json(
      new resModels({ data: [], status: 500, message: "获取验证码失败！" })
    );
});

/* 获取用户列表 */
router.get("/list", function (req, res, next) {
  getUserInfo(req.query).then((data) => {
    if (data) {
      res.json(new resModels({ data: data, status: 200, message: "OK！" }));
    }
  });
});
/* 新增用户 */
router.post("/new", function (req, res, next) {
  if (req.session.auth === 1) {
    isRepeat(req.body.username)
      .then((data) => {
        if (data.length > 0) {
          res.json(
            new resModels({ data: [], message: "该用户已存在", status: 403 })
          );
        } else {
          newUser(req.body)
            .then((data) => {
              res.json(new resModels({ data, status: 200, message: "OK!" }));
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.json(new resModels({ data: [], status: 403, message: "权限不足！" }));
  }
});

/* 删除用户 */
router.post("/delete", function (req, res, next) {
  if (req.session.auth === 1) {
    if (req.body.id.indexOf(req.session.userId) > -1) {
      res.json(
        new resModels({
          data: [],
          message: "不能删除自己的账号！",
          status: 403,
        })
      );
    } else {
      deleteUser(req.body.id)
        .then((data) => {
          res.json(new resModels({ data, status: 200, message: "OK!" }));
        })
        .catch((err) =>
          res.json(new resModels({ message: "参数不匹配！", status: 400 }))
        );
    }
  } else {
    res.json(new resModels({ data: [], status: 403, message: "权限不足！" }));
  }
});

/* 编辑用户 */
router.post("/update", function (req, res, next) {
  if (req.session.auth === 1) {
    updateUser(req.body)
      .then((data) => {
        res.json(new resModels({ data, status: 200, message: "OK!" }));
      })
      .catch((err) => {
        res.json(
          new resModels({ data: err, message: "参数不匹配！", status: 400 })
        );
      });
  }
});

module.exports = router;
