var express = require('express')
var router = express.Router()
const svgCaptcha = require('svg-captcha')
const { createToken, checkToken } = require('../utils/token')
const resModels = require('../model/resModels')
const { getMenuList, getMenu,newMenu,delMenu } = require('../control/menu')
const xss = require('xss')
const { getListFun, updateFun, delFun } = require('../utils/index')
const { getStrToObj, setObjToStr,setTree } = require('../utils/index')

/* 获取菜单列表 */
// 分页
router.get('/treelist', function (req, res, next) {
	getListFun(getMenuList, req, res, (data) => {
        return setTree(data)
	})
})
// 不分页
router.get('/tree', function (req, res, next) {
	getListFun(getMenu, req, res, (data) => {
		return setTree(data)
	})
})
/* 更新菜单 */
router.post('/save', function (req, res, next) {
	updateFun(newMenu, req, res, (data) => {
		for (const key in data) {
			
		}
		return data
	})
})

/* 删除菜单 */
router.post("/delete", function (req, res, next) {
    delFun(delMenu, req, res);
  });

module.exports = router
