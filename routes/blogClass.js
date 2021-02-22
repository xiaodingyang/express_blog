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

/* 更新分类 */
router.post('/save', function (req, res, next) {
	updateFun(newClass, req, res)
})

// 删除分类
router.post("/delete", function (req, res, next) {
  delFun(deleteClass, req, res);
});

module.exports = router;
