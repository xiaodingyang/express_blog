const {
    exec
} = require('../db/mysql')
const xss = require('xss')
var { setArrToStr } = require('../utils/index');

const getList = () => {
    let sql = 'select * from imgs where 1=1 '
    return exec(sql)
}

const newImgs = ({ swiperImgs = '', navImgs = '', appBgImgs = '', otherBgImgs = '', otherImgs = '', musics = '' }) => {

    let sql = `insert into imgs(swiperImg, navImg, appBgImg, otherBgImg, otherImg, music) values ('${swiperImgs}', '${navImgs}', '${appBgImgs}', '${otherBgImgs}', '${otherImgs}', '${musics}')`
    return exec(sql)
}

const updateImgs = ({ id = '', swiperImgs = '', navImgs = '', appBgImgs = '', otherBgImgs = '', otherImgs = '', musics = '' }) => {
    let sql = `update imgs set swiperImg='${swiperImgs}', navImg='${navImgs}', appBgImg='${appBgImgs}', otherBgImg='${otherBgImgs}', otherImg='${otherImgs}', music='${musics}' where id='${id}'`
    return exec(sql).then(data => {
        return data.affectedRows
    })
}

const delImgs = (id = '') => {
    let sql = `delete from imgs where id in (${id})`
    return exec(sql).then(data => {
        return data.affectedRows
    })
}

module.exports = {
    getList,
    newImgs,
    updateImgs,
    delImgs
}