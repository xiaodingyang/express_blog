const resModels = require("../model/resModels");
const xss = require("xss");

// 对象数组转为字符串
function setObjToStr(arr) {
  if (arr && arr !== "undefined" && Array.isArray(arr)) {
    const str = arr.map((item) => {
      return JSON.stringify(item);
    });
    return str.join("xdy");
  } else {
    return [];
  }
}
// 对象数组类型字符串转为对象数组
function getStrToObj(str) {
  if (str && str !== "undefined") {
    const arr = str.split("xdy");
    return arr.length > 0
      ? arr.map((item) => {
          if (typeof item == "string") {
            try {
              if (item) return JSON.parse(item);
            } catch (e) {
              return false;
            }
          }
        })
      : "";
  } else {
    return "";
  }
}

// 获取列表函数
function getListFun(func, req, res, dataRest) {
  for (const key in req.query) {
    req.query[key] = xss(req.query[key]);
  }
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
  if (dataRest) {
    req.body = dataRest(req.body);
  } else {
    for (const key in req.body) {
      req.body[key] = xss(req.body[key]);
    }
  }
  func(req.body, req)
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
  func(req.body.id)
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
