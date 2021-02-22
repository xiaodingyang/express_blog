const mysql = require('mysql')
const { MYSQL_CONFIG } = require('../config/db')

// 创建连接对象
const connection = mysql.createConnection(MYSQL_CONFIG)

// 开始连接
connection.connect()

// 统一 执行sql 的函数

function exec(sql) {
	return new Promise((resolve, reject) => {
		connection.query(sql, (err, result) => {
			if (err) {
				console.log(err)
				reject(err)
				return
			}
			resolve(result)
		})
	})
}

function page({ dataSql, pageSql, curPage, pageSize }) {
	return exec(pageSql).then((data) => {
		const total = data[0] ? data[0]['count(1)'] : 0
		return exec(dataSql).then((data) => {
			return {
				data: data,
				total: parseInt(total),
				curPage: parseInt(curPage),
				pageSize: parseInt(pageSize),
			}
		})
	})
}

// 分页查询
function setSql({
	name,
	search,
	likeSearch,
	orderKey,
	order,
	curPage,
	pageSize,
}) {
	let dataSql = `select * from ${name}  where 1=1 `
	let pageSql = `select count(1) from ${name}  where 1=1 `
	let str = ''
	if(search){
        for (const k in search) {
            if (search[k]) str += `and ${k}='${search[k]}' `
        }
    }
	if(likeSearch){
        for (const k in likeSearch) {
            if (likeSearch[k]) str += `and ${k} like'%${likeSearch[k]}%' `
        }
    }
	pageSql += str
	if (orderKey) {
		str += ` order by ${orderKey} ${order || 'desc'} `
	}
	if (curPage && pageSize)
		str += 'limit ' + pageSize + ' offset ' + (curPage - 1) * pageSize
    dataSql += str
	return page({ dataSql, pageSql, curPage, pageSize })
}

// 不分页查询
function setNoPageSql({ name, likeSearch,orderKey, order}) {
	let dataSql = `select * from ${name}  where 1=1 `
	let str=''
	if(likeSearch){
        for (const k in likeSearch) {
            if (likeSearch[k]) str += `and ${k} like'%${likeSearch[k]}%' `
        }
    }
    if (orderKey) {
		str += ` order by ${orderKey} ${order || 'desc'} `
	}
    dataSql += str
	return exec(dataSql).then((data) => {
		return {
			data: data,
		}
	})
}

module.exports = {
	exec,
	page,
	setSql,
	setNoPageSql,
}
