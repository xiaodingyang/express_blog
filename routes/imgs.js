var express = require('express');
var { getStrToArr } = require('../utils/index');
var router = express.Router();
const {
    getList,
    newImgs,
    delImgs,
    updateImgs,
} = require('../control/imgs')

const ResModels = require('../model/resModels')
const xss = require('xss')

// 获取图片
router.get('/list', function (req, res, next) {
    for (const key in req.query) {
        req.query[key] = xss(req.query[key])
    }
    getList(req.query).then(data => {

        data = data.map(item => {

            for (const key in item) {
                if (key !== 'id') {
                    if (key === 'otherBgImg') {
                        item[key] = JSON.parse(item[key])
                    } else if (key === 'otherImg') {
                        item[key] = JSON.parse(item[key])
                    } else {
                        item[key] = item[key] ? item[key].split(',') : []
                    }

                }

            }
            return item
        })

        res.json(new ResModels({ data, status: 200, message: 'OK!' }))
    })

});

// 新增图片
router.post('/new', function (req, res, next) {
    if (req.session.username) {
        for (const key in req.body) {
            if (key === 'otherBgImgs') {
                req.body.otherBgImgs = JSON.stringify(req.body.otherBgImgs)
            } else if (key === 'otherImgs') {
                req.body.otherImgs = JSON.stringify(req.body.otherImgs)
            }
            else {
                req.body[key] = xss(req.body[key])
            }
        }
        newImgs(req.body).then(data => {
            res.json(new ResModels({ data, status: 200, message: 'OK!' }))
        }).catch(err => console.log(err))
    } else {
        res.json(new ResModels({ data: [], message: '未登录！', status: 403 }))
    }
});

// 更新图片
router.post('/update', function (req, res, next) {
    if (req.session.username) {
        for (const key in req.body) {
            if (key === 'otherBgImgs') {
                req.body.otherBgImgs = JSON.stringify(req.body.otherBgImgs)
            } else if (key === 'otherImgs') {
                req.body.otherImgs = JSON.stringify(req.body.otherImgs)
            }
            else {
                req.body[key] = xss(req.body[key])
            }
        }
        updateImgs(req.body).then(data => {
            res.json(new ResModels({ data, status: 200, message: 'OK!' }))
        }).catch(err => console.log(err)
        )
    } else {
        res.json(new ResModels({ data: [], message: '未登录！', status: 403 }))
    }
});

// 删除图片
router.post('/delete', function (req, res, next) {
    if (req.session.username) {
        delImgs(req.body.id, req.session.realname).then(data => {
            res.json(new ResModels({ data, status: 200, message: 'OK!' }))
        }).catch(err => res.json(new ResModels({ data: [], message: '参数不匹配！', status: 400 })))
    } else {
        res.json(new ResModels({ data: [], message: '未登录！', status: 403 }))
    }
});

module.exports = router;