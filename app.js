var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser"); // 使用 cookieParser 解析cookie
var logger = require("morgan"); // 生成日志
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
var app = express();
var blogRouter = require("./routes/blog");
var userRouter = require("./routes/user");
var blogClassRouter = require("./routes/blogClass");
var imgsRouter = require("./routes/imgs");
var resumeRouter = require("./routes/resume");
var loginCheck = require("./middleWare/loginCheck");
app.set("view engine", "ejs");
//解决跨域
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, Access-Token"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// session 设置
const { redisClient } = require("./db/redis");
const sessionStore = new RedisStore({
  client: redisClient,
});

app.use(
  session({
    secret: "XiaoDingYang",
    resave: true,
    saveUninitialized: true,
    credentials: true,
    origin: true,
    cookie: {
      path: "/", // 默认配置
      httpOnly: true, // 默认配置
      maxAge: 24 * 3600 * 1000, // 过期时间，24小时之后过期
    },
    store: sessionStore,
  })
);

app.use(logger("dev"));
app.use(express.json()); // 处理 postData (post方式、application/json 格式的数据)
app.use(
  express.urlencoded({
    // 处理post其他格式的数据
    extended: false,
  })
);
app.use(cookieParser());
app.use(loginCheck);

/* 注册路由，文件内部的路径为子路径，当前配置的为父路径 */

app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);
app.use("/api/blogClass", blogClassRouter);
app.use("/api/imgs", imgsRouter);
app.use("/api/resume", resumeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

module.exports = app;
