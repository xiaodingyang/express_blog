var express = require("express");
var router = express.Router();
const { getList, newImgs, delImgs } = require("../control/imgs");
const { getStrToObj, setObjToStr } = require("../utils/index");
const { getListFun, updateFun, delFun } = require("../utils/index");

const ResModels = require("../model/resModels");
const xss = require("xss");

// 获取图片
router.get("/list", function (req, res, next) {
  getListFun(getList, req, res, (data) => {
    data = data.map((item) => {
      for (const key in item) {
        if (key === "imgList") item[key] = getStrToObj(item[key]);
      }
      return item;
    });
  });
});

// 更新图片
router.post("/save", function (req, res, next) {
  updateFun(newImgs, req, res, (data) => {
    for (const key in data) {
      if (key === "imgList") data[key] = setObjToStr(data[key]);
    }
    return data;
  });
});

// 删除图片
router.post("/delete", function (req, res, next) {
  delFun(delImgs, req, res);
});

module.exports = router;
