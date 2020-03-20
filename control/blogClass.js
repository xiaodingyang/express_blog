const {
    exec
} = require('../db/mysql')
const xss = require('xss')
const getList = ({ name }) => {
    let sql = 'select * from blogsclass where 1=1 '
    if (name) sql += `and name='${name}' `
    return exec(sql)
}


const newClass = ({ code, name }) => {
    let sql = `insert into blogsclass(code, name) values ('${code}', '${name}')`
    return exec(sql)
}

const updateClass = ({ code, name, id }) => {
    let sql = `update blogsclass set code='${code}', name='${name}' where id='${id}'`
    return exec(sql).then(data => {
        return data.affectedRows
    })
}

const deleteClass = (id = '') => {
    let sql = `delete from blogsclass where id in (${id})`
    return exec(sql).then(data => {
        return data.affectedRows
    })
}

module.exports = {
    getList,
    newClass,
    updateClass,
    deleteClass
}