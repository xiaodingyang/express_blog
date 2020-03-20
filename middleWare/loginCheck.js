const ResModels = require('../model/resModels')

module.exports = (req, res, next) => {
    console.log('ggggg', res.session);

    if (req.session.username) {
        next()
        return
    }

    return new ResModels({ message: '未登录！', status: 403 })
}