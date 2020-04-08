const resModels = require("../model/resModels");
// 对象数组转为字符串
function setObjToStr(arr) {
  if (arr && arr !== "undefined" && Array.isArray(arr)) {
    const str = arr.map((item) => {
      return JSON.stringify(item);
    });
    return str.join("xdy");
  }
}
// 对象数组类型字符串转为对象数组
function getStrToObj(str) {
  if (str && str !== "undefined") {
    const arr = str.split("xdy");
    return arr.length > 0
      ? arr.map((item) => {
          if (item) return JSON.parse(item);
        })
      : "";
  }
}

// 获取列表函数
function getListFun(func, req, res, dataRest) {
  func(req.query)
    .then((data) => {
      if (data) {
        dataRest && dataRest(data);
        res.json(new resModels({ data: data, status: 200, message: "OK！" }));
      }
    })
    .catch((err) => {
      console.log(err);
      res.json(new resModels({ data: [], message: "服务器错误", status: 400 }));
    });
}
// 更新函数
function updateFun(func, req, res, dataRest) {
  req.body.realname = req.session.realname ? req.session.username : "";
  req.body = dataRest ? dataRest(req.body) : req.body;
  func(req.body)
    .then((data) => {
      if (data) {
        res.json(new resModels({ data: [], status: 200, message: "OK！" }));
      }
    })
    .catch((err) => {
      console.log(err);
      res.json(new resModels({ data: [], message: "服务器错误", status: 400 }));
    });
}
// 删除函数
function delFun(func, req, res) {
  func(req.body.id, req.session.realname)
    .then((data) => {
      res.json(new resModels({ data: [], status: 200, message: "OK!" }));
    })
    .catch((err) => {
      console.log(err);
      res.json(new resModels({ data: [], message: "服务器错误", status: 400 }));
    });
}

module.exports = {
  setObjToStr,
  getStrToObj,
  getListFun,
  updateFun,
  delFun,
};
