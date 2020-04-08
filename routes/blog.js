var express = require("express");
var router = express.Router();
const { getListFun, updateFun, delFun } = require("../utils/index");

const { getList, newBlog, updateBlog, delBlog } = require("../control/blog");

// const ResModels = require("../model/resModels");
const xss = require("xss");

// 获取博客
router.get("/list", function(req, res, next) {
  for (const key in req.query) {
    req.query[key] = xss(req.query[key]);
  }
  getListFun(getList, req, res, data => {
    data = data.map(item => {
      item.content = unescape(item.content);
      item.description = unescape(item.description);
      return item;
    });
  });
});

// 新建博客
router.post("/new", function(req, res, next) {
  updateFun(newBlog, req, res);
});

// 更新博客
router.post("/update", function(req, res, next) {
  updateFun(updateBlog, req, res);
});

// 删除博客
router.post("/delete", function(req, res, next) {
  delFun(delBlog, req, res);
});

module.exports = router;
