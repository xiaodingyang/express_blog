const {
    exec
} = require('../db/mysql')

const {
    genPassword
} = require('../utils/crypto')

const login = (username = '', password = '') => {
    password = genPassword(password)
    const sql = `select id,username,realname,auth from users where username='${username}' and password='${password}'`
    return exec(sql).then(data => data[0] || {})
}

/* 获取用户列表 */
const getUserInfo = ({ username, realname, auth }) => {
    let sql = `select * from users where 1=1 `
    if (username) sql += `and username like '%${username}%' `
    if (realname) sql += `and realname like '%${realname}%' `
    if (auth) sql += `and auth = '${realname}'`
    return exec(sql)
}

/* 查重 */
const isRepeat = (username) => {
    let sql = `select * from users where username = '${username}'`
    return exec(sql)
}


/* 新增用户 */
const newUser = ({ username, password, realname, auth, phone, email, address, age }) => {
    password = genPassword(password)
    let sql = `insert into users(username, password, realname, auth, phone, email, address, age) values ('${username}', '${password}', '${realname}', '${auth}', '${phone}', '${email}', '${address}', '${age}');`

    return exec(sql)
}
/* 删除用户 */
const deleteUser = (id) => {
    const sql = `delete from users where id in(${id});`
    return exec(sql)
}
/* 编辑用户 */
const updateUser = ({ id, username, password, realname, auth, phone, email, address, age }) => {

    password = genPassword(password)
    const sql = `update users set \`password\`='${password}' username='${username}' and realname='${realname}' and auth='${auth}' and phone='${phone}' and email='${email}' and address='${address}' and age='${age}'  where id='${id}';`
    console.log(sql);

    return exec(sql)
}

module.exports = {
    login,
    getUserInfo,
    newUser,
    updateUser,
    deleteUser,
    isRepeat,
}