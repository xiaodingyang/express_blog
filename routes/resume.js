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
      item.skillList = getStrToObj(item.skillList);
    });
  });
});
// 更新简历
router.post("/base/save", function (req, res, next) {
  updateFun(updateResumeBase, req, res, (data) => {
    for (const key in data) {
      if (key === "skillLists") {
        data.skillLists = setObjToStr(data.skillLists);
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
      item.experience = getStrToObj(unescape(item.experience));
      item.timeList = item.timeList.split(",");
    });
  });
});
// 更新经验
router.post("/experience/save", function (req, res, next) {
  updateFun(updateResumeEx, req, res, (data) => {
    for (const key in data) {
      if (key === "experiences") {
        data.experiences = setObjToStr(data.experiences);
      } else {
        data[key] = xss(data[key]);
      }
    }
    return data;
  });
});

// 删除经验
router.post("/experience/delete", function (req, res, next) {
  delFun(delResumeEx, req, res);
});

module.exports = router;
