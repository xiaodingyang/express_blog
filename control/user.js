const { exec, setSql } = require('../db/mysql')
const { getPassword } = require('../utils/crypto')
const { dateFormat } = require('../utils/index')

const login = (username = '', password = '', req) => {
    password = getPassword(password)
	const sql = `select * from users where username='${username}' and password='${password}'`
	return exec(sql).then((data) => {
		if (data && data[0]) {
            if(data[0].headImg)data[0].headImg = JSON.parse(unescape(data[0].headImg))
            req.session.userInfo = data[0]
            
		}
		return data[0] || {}
	})
}

/* 获取用户列表 */
const getUserInfo = ({
	username,
	realname,
	auth,
	currentPage = 1,
	pageSize = 10,
}) => {
	const params = {
		name: 'users',
		search: {
			auth,
		},
		likeSearch: {
			username,
			realname,
		},
		currentPage,
		pageSize,
	}
	return setSql(params)
}

/* 查重 */
const isRepeat = (username) => {
	let sql = `select * from users where username = '${username}'`
	return exec(sql)
}

/* 新增用户 */
const newUser = ({ id, key, val, str }) => {
	key += `,createdTime`
	val += `,${dateFormat({ format: 'YYYY-MM-dd hh:mm:ss' })}`
	str += `,createdTime="${dateFormat({ format: 'YYYY-MM-dd hh:mm:ss' })}"`
	let sql = ''
	if (id) {
		sql = `update users set ${str.slice(1)} where id='${id}';`
	} else {
		sql = `insert into users(${key.slice(1)}) values (${val.slice(1)});`
	}
	return exec(sql)
}
/* 删除用户 */
const deleteUser = (id) => {
	const sql = `delete from users where id in(${id});`
	return exec(sql)
}

// 修改密码
const resetPassword = ({ password }, req) => {
	password = getPassword(password)
	sql = `update users set password='${password}' where id='${req.session.userInfo.id}';`
	return exec(sql)
}

module.exports = {
	login,
	getUserInfo,
	newUser,
	deleteUser,
	isRepeat,
	resetPassword,
}
