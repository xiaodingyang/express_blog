const resModels = require('../model/resModels')
const xss = require('xss')

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
	func(req.body, req)
		.then((data) => {
			if (data) {
				res.json(
					new resModels({ data: [], status: true, message: 'OK！' })
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

module.exports = {
	setObjToStr,
	getStrToObj,
	getListFun,
	updateFun,
	delFun,
	setTree,
}
