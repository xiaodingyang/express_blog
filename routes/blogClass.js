var express = require("express");
var router = express.Router();
const xss = require("xss");
const {
  getList,
  newClass,
  updateClass,
  deleteClass,
} = require("../control/blogClass");
const ResModels = require("../model/resModels");

// 获取分类
router.get("/list", function (req, res, next) {
  for (const key in req.query) {
    req.query[key] = xss(req.query[key]);
  }
  getList(req.query).then((data) => {
    res.json(new ResModels({ data, status: 200, message: "OK!" }));
  });
});

// 新建分类
router.post("/new", function (req, res, next) {
  for (const key in req.body) {
    req.body[key] = xss(req.body[key]);
  }
  newClass(req.body)
    .then((data) => {
      res.json(new ResModels({ data, status: 200, message: "OK!" }));
    })
    .catch((err) =>
      res.json(
        new ResModels({ data: [], message: "参数不匹配！", status: 400 })
      )
    );
});

// 更新分类
router.post("/update", function (req, res, next) {
  for (const key in req.body) {
    req.body[key] = xss(req.body[key]);
  }
  updateClass(req.body)
    .then((data) => {
      res.json(new ResModels({ data, status: 200, message: "OK!" }));
    })
    .catch((err) =>
      res.json(
        new ResModels({ data: [], message: "参数不匹配！", status: 400 })
      )
    );
});

// 删除分类
router.post("/delete", function (req, res, next) {
  deleteClass(req.body.id)
    .then((data) => {
      res.json(new ResModels({ data, status: 200, message: "OK!" }));
    })
    .catch((err) =>
      res.json(
        new ResModels({ data: [], message: "参数不匹配！", status: 400 })
      )
    );
});

module.exports = router;
