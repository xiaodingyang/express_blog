/* 
成功和失败的模型封装
@params status === 0 请求成功
@params status === 1 用户名或者密码不正确
@params status === 2 验证码不正确
 */

module.exports = class msgModel {
    constructor({ data, message, status }) {
        if (data) this.data = data
        if (message) this.message = message
        if (status) this.status = status
    }
}

