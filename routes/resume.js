var express = require("express");
var router = express.Router();
const { getListFun, updateFun, delFun } = require("../utils/index");
const {
  getResumeBase,
  getResumeEx,
  updateResumeBase,
  updateResumeEx,
  delResumeBase,
  delResumeEx,
} = require("../control/resume");
const xss = require("xss");

const { getStrToObj, setObjToStr } = require("../utils/index");
// 获取简历列表
router.get("/base/list", function (req, res, next) {
  getListFun(getResumeBase, req, res, (data) => {
    data = data.forEach((item) => {
      item.skillList = JSON.parse(unescape(item.skillList));
    });
  });
});
// 更新简历
router.post("/base/save", function (req, res, next) {
  updateFun(updateResumeBase, req, res, (data) => {
    for (const key in data) {
      if (key === "skillList") {
        data.skillList = escape(JSON.stringify(data.skillList));
      } else {
        data[key] = xss(data[key]);
      }
    }
    return data;
  });
});

// 删除简历
router.post("/base/delete", function (req, res, next) {
  delFun(delResumeBase, req, res);
});

// 获取经验列表
router.get("/experience/list", function (req, res, next) {
  getListFun(getResumeEx, req, res, (data) => {
    data.forEach((item) => {
      item.experience = JSON.parse(unescape(item.experience));
      item.timeList = JSON.parse(unescape(item.timeList))
    });
  });
});
// 更新经验
router.post("/experience/save", function (req, res, next) {
  updateFun(updateResumeEx, req, res, (data) => {
    if(data.experience)data.experience = escape(JSON.stringify(data.experience))
    if(data.timeList)data.timeList = escape(JSON.stringify(data.timeList))
    return data;
  });
});

// 删除经验
router.post("/experience/delete", function (req, res, next) {
  delFun(delResumeEx, req, res);
});

module.exports = router;
