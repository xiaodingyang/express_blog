const crypto = require('crypto')

// 秘钥
const SECRET_KEY = 'XIAODINGYANG'

// md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

// 加密函数
function getPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}
module.exports = {
    getPassword
}