const resModels = require('../model/resModels')
const xss = require('xss')
const { getPassword } = require('../utils/crypto')

// 对象数组转为字符串
function setObjToStr(arr) {
	if (arr && arr !== 'undefined' && Array.isArray(arr)) {
		const str = arr.map((item) => {
			return JSON.stringify(item)
		})
		return str.join('xdy')
	} else {
		return []
	}
}
// 对象数组类型字符串转为对象数组
function getStrToObj(str) {
	if (str && str !== 'undefined') {
		const arr = str.split('xdy')
		return arr.length > 0
			? arr.map((item) => {
					if (typeof item == 'string') {
						try {
							if (item) return JSON.parse(item)
						} catch (e) {
							return false
						}
					}
			  })
			: ''
	} else {
		return ''
	}
}

// 获取列表函数
function getListFun(func, req, res, dataRest) {
	for (const key in req.query) {
		req.query[key] = xss(req.query[key])
	}
	func(req.query)
		.then((data) => {
			if (data) {
				if (dataRest) data.data = dataRest(data.data) || data.data
				res.json(
					new resModels({
						data: {
							list: data.data,
							total: data.total,
							currentPage: data.currentPage,
							pageSize: data.pageSize,
						},
						status: true,
						message: 'OK！',
					})
				)
			}
		})
		.catch((err) => {
			console.log(err)
			res.json(
				new resModels({
					message: '服务器错误',
					status: false,
				})
			)
		})
}
// 更新函数
function updateFun(func, req, res, dataRest) {
	if (dataRest) {
		req.body = dataRest(req.body)
	} else {
		for (const key in req.body) {
			req.body[key] = xss(req.body[key])
		}
	}
	let key = '',
		val = '',
		str = ''
	for (const k in req.body) {
		if (k === 'password') req.body[k] = getPassword(req.body[k])
		if (req.body[k] !== 'undefined') {
			key += ',' + k
			val += `,"${req.body[k]}"`
			str += `,${k}="${req.body[k]}"`
		}
	}
	func({ id: req.body.id, key, val, str })
		.then((data) => {
			if (data) {
				res.json(new resModels({ status: true, message: 'OK！' }))
			}
		})
		.catch((err) => {
			console.log(err)
			res.json(
				new resModels({
					message: '服务器错误',
					status: false,
				})
			)
		})
}
// 删除函数
function delFun(func, req, res) {
	console.log('req.body', req.body)
	func(req.body.id)
		.then((data) => {
			res.json(new resModels({ status: true, message: 'OK!' }))
		})
		.catch((err) => {
			console.log(err)
			res.json(
				new resModels({
					message: '服务器错误',
					status: false,
				})
			)
		})
}

// 将数据组装成树结构
// 清除没有数据的children
function clearTree(data) {
	data.forEach((item) => {
		if (item.children.length === 0) {
			delete item.children
		} else {
			clearTree(item.children)
		}
	})
	return data
}
function setTree(data) {
	data.forEach((item) => {
		item.children = [] // 初始化children
		data.forEach((_item, idx) => {
			// 1. 第二层push到根节点的children 2. 第三层push 到第二层根节点，由于第二层的数据是引用类型，因此之前被push到第一层的数据也会push第三层的数据 3. 最后清除不是根节点的数据就可以得到整个树
			if (item.id === _item.parentId) {
				item.children.push(_item)
			}
		})
	})
	// filter清除不是根节点的树
	return clearTree(data.filter((item) => !item.parentId))
}

//* *************************************日期格式化**************************************************//
function dateFormat({ time, format }) {
	let dd = time ? new Date(time) : new Date()
	var o = {
		M: dd.getMonth() + 1, // 月份
		d: dd.getDate(), // 日
		h: dd.getHours(), // 小时
		H: dd.getHours(), // 小时
		m: dd.getMinutes(), // 分
		s: dd.getSeconds(), // 秒
	}
	// 年，不区分大小写
	if (/(y+)/i.test(format)) {
		// RegExp这个对象会在我们调用了正则表达式的方法后, 自动将最近一次的结果保存在里面, 所以如果我们在使用正则表达式时, 有用到分组, 那么就可以直接在调用完以后直接使用RegExp.$xx来使用捕获到的分组内容
		format = format.replace(RegExp.$1, dd.getFullYear())
	}
	for (var k in o) {
		if (new RegExp(`(${k}+)`).test(format)) {
			format = format.replace(
				RegExp.$1,
				('00' + o[k]).slice(('' + o[k]).length)
			)
		}
	}
	return format
}

module.exports = {
	setObjToStr,
	getStrToObj,
	getListFun,
	updateFun,
	delFun,
	setTree,
	dateFormat,
}
