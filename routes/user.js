var express = require('express')
var router = express.Router()
const svgCaptcha = require('svg-captcha')
const { createToken, checkToken } = require('../utils/token')
const resModels = require('../model/resModels')
const {
	login,
	getUserInfo,
	newUser,
	deleteUser,
	isRepeat,
	resetPassword,
} = require('../control/user')
const xss = require('xss')
const { getListFun, updateFun, delFun } = require('../utils/index')
const { getStrToObj, setObjToStr } = require('../utils/index')

router.post('/login', function (req, res, next) {
	const identifying = xss(req.body.identifying)
	const password = xss(req.body.password)
	const username = xss(req.body.username)

	login(username, password, req).then((data) => {
		if (data && data.username) {
			const token = createToken(data)
			// 向客户端设置一个Cookie
			const userInfo = {
				...data,
				token,
			}
			if (identifying.toLowerCase() === req.session.captcha) {
				res.json(
					new resModels({
						data: userInfo,
						message: '登录成功！',
						status: true,
					})
				)
			} else {
				res.json(
					new resModels({ message: '验证码错误！', status: false })
				)
				return
			}

			return
		} else {
			res.json(
				new resModels({
					message: '用户名或密码错误！',
					status: false,
				})
			)
		}
	})
})
/* 验证码 */
router.get('/captcha', function (req, res, next) {
	const cap = svgCaptcha.create({
		// 翻转颜色
		inverse: false,
		// 字体大小
		fontSize: 36,
		color: '#fff',
		// 噪声线条数
		noise: 1,
		// 宽度
		width: 80,
		// 高度
		height: 30,
	})

	req.session.captcha = cap.text.toLowerCase() // session 存储验证码数值 忽略大小写
	res.type('image/svg+xml') // 响应的类型
	if (cap.data) res.json(new resModels({ data: cap.data, status: true }))
	else
		res.json(
			new resModels({
				status: false,
				message: '获取验证码失败！',
			})
		)
})

/* 获取用户信息 */
router.get('/info', function (req, res, next) {
    if(req.session.userInfo){
        res.json(new resModels({ data: req.session.userInfo, status: true }))
    }else{
        res.json(new resModels({ message: '用户信息获取失败！', status: false }))
    }
	
})
/* 获取用户列表 */
router.get('/list', function (req, res, next) {
	getListFun(getUserInfo, req, res, (data) => {
		data = data.map((item) => {
			item.headImg = getStrToObj(item.headImg)
			return item
		})
		return data
	})
})
/* 更新用户 */
router.post('/save', function (req, res, next) {
	if (req.body.id) {
		updateFun(newUser, req, res, (data) => {
			for (const key in data) {
				if (key === 'headImg') {
					data.headImg = setObjToStr(data.headImg)
				} else {
					data[key] = xss(data[key])
				}
			}
			return data
		})
		return
	}
	isRepeat(req.body.username)
		.then((data) => {
			if (data.length > 0) {
				res.json(
					new resModels({
						message: '该用户已存在',
						status: false,
					})
				)
			} else {
				updateFun(newUser, req, res, (data) => {
					for (const key in data) {
						if (key === 'headImg') {
							data.headImg = setObjToStr(data.headImg)
						} else {
							data[key] = xss(data[key])
						}
					}
					return data
				})
			}
		})
		.catch((err) => console.log(err))
})

/* 删除用户 */
router.post('/delete', function (req, res, next) {
	if (req.body.id === req.session.userInfo.id) {
		res.json(
			new resModels({
				message: '不能删除自己的账号！',
				status: false,
			})
		)
	} else {
		delFun(deleteUser, req, res)
	}
})
/* 获取密码 */
router.post('/password/list', function (req, res, next) {
	res.json(
		new resModels({
			data: req.session.userInfo,
			message: 'OK!',
			status: true,
		})
	)
})
/* 修改密码 */
router.post('/password/save', function (req, res, next) {
	updateFun(resetPassword, req, res)
})
module.exports = router
