const {
    exec
} = require('../db/mysql')
const moment = require('moment')

const getList = ({ id, type, title, description, author, content, orderKey, order, key }) => {

    let sql = `select * from blogs where 1=1 `

    if (id) sql += `and id='${id}' `
    if (type) sql += `and type='${type}' `
    if (title) sql += `and title like'%${title}%' `
    if (description) sql += `and description like'%${description}%' `
    if (author) sql += `and author like'%${author}%' `
    if (content) sql += `and content like'%${content}%' `
    if (orderKey) {
        sql += ` order by ${orderKey} ${order}`
    } else {
        sql += ` order by createdTime desc`
    }
    return exec(sql)
}


const newBlog = ({ title, content, description, realname, src, type }) => {
    content = escape(content)
    description = escape(description)
    let sql = `insert into blogs(type, title,description, src, content, createdTime, author) values ('${type}', '${title}','${description}',   '${src}', '${content}', '${moment().format('YYYY-DD-MM')}','${realname}')`
    return exec(sql).then(data => {
        return {
            id: data.insertId
        }
    })
}

const updateBlog = ({ type, title, description, content, src, id }) => {
    description = escape(description)
    content = escape(content)
    let sql = `update blogs set type='${type}', title='${title}', description='${description}', content='${content}', src='${src}' where id='${id}'`
    return exec(sql).then(data => {
        return data.affectedRows
    })
}

const delBlog = (id = '') => {
    let sql = `delete from blogs where id in (${id})`
    return exec(sql).then(data => {
        return data.affectedRows
    })
}

module.exports = {
    getList,
    newBlog,
    updateBlog,
    delBlog
}