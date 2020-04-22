var express = require("express");
var router = express.Router();
const { getListFun, updateFun, delFun } = require("../utils/index");
const { getList, newBlog, updateBlog, delBlog } = require("../control/blog");
const xss = require("xss");
const { getStrToObj, setObjToStr } = require("../utils/index");
const resModels = require("../model/resModels");

// 获取博客
router.get("/list", function (req, res, next) {
  getListFun(getList, req, res, (data) => {
    data = data.map((item) => {
      item.content = unescape(item.content);
      item.description = unescape(item.description);
      item.src = getStrToObj(item.src);
      return item;
    });
  });
});

// 更新博客
router.post("/save", function (req, res, next) {
  updateFun(updateBlog, req, res, (data) => {
    for (const key in data) {
      if (key === "src") {
        data.src = setObjToStr(data.src);
      } else {
        data[key] = xss(data[key]);
      }
    }
    data.author = req.session.userInfo.realname;
    return data;
  });
});

// 删除博客
router.post("/delete", function (req, res, next) {
  delFun(delBlog, req, res);
});

router.post("/upload", function (req, res, next) {
  res.json(new resModels({ data: [], status: 200, message: "OK！" }));
});
module.exports = router;
