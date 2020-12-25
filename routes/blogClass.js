var express = require("express");
var router = express.Router();
const xss = require("xss");
const { getListFun, updateFun, delFun } = require("../utils/index");

const {
  getList,
  newClass,
  updateClass,
  deleteClass,
} = require("../control/blogClass");
const ResModels = require("../model/resModels");

// 获取分类
router.get("/list", function (req, res, next) {
  getListFun(getList, req, res);
});

// 新建分类
router.post("/new", function (req, res, next) {
  for (const key in req.body) {
    req.body[key] = xss(req.body[key]);
  }
  newClass(req.body)
    .then((data) => {
      res.json(new ResModels({ data, status: true, message: "OK!" }));
    })
    .catch((err) =>
      res.json(
        new ResModels({ data: [], message: "参数不匹配！", status: false })
      )
    );
});

// 更新分类
router.post("/update", function (req, res, next) {
  updateFun(updateClass, req, res);
});

// 删除分类
router.post("/delete", function (req, res, next) {
  delFun(deleteClass, req, res);
});

module.exports = router;
