var express = require("express");
var router = express.Router();
const { getList, newImgs, delImgs } = require("../control/imgs");
const {
  getStrToObj,
  setObjToStr,
  getListFun,
  updateFun,
  delFun,
} = require("../utils/index");
// const {  } = require("../utils/index");

const ResModels = require("../model/resModels");
const xss = require("xss");

// 获取图片
router.get("/list", function (req, res, next) {
  getListFun(getList, req, res, (data) => {
    data = data.map((item) => {
      for (const key in item) {
        if (key === "imgList") {
            if(item[key]&&item[key]!=='null'){
                const arr = item[key].split(',')
                item[key] = arr.map(item=>{
                    try {
                        return JSON.parse(unescape(item))
                    } catch (error) {
                        
                    }
                    
                })
            }else{
                item[key] = []
            }
            
        }
      }
      return item;
    });
  });
});

// 更新图片
router.post("/save", function (req, res, next) {
  updateFun(newImgs, req, res, (data) => {
    for (const key in data) {
      if (key === "imgList") data[key] = data.imgList.map(item=>escape(JSON.stringify(item)));
    }
    return data;
  });
});

// 删除图片
router.post("/delete", function (req, res, next) {
  delFun(delImgs, req, res);
});

module.exports = router;
