var express = require('express');
var router = express.Router();
const {
    getList,
    newBlog,
    updateBlog,
    delBlog,
} = require('../control/blog')

const ResModels = require('../model/resModels')
const xss = require('xss')

// 获取博客
router.get('/list', function (req, res, next) {
    for (const key in req.query) {
        req.query[key] = xss(req.query[key])
    }
    getList(req.query).then(data => {
        data = data.map(item => {
            item.content = unescape(item.content)
            item.description = unescape(item.description)
            return item
        })

        res.json(new ResModels({ data, status: 200, message: 'OK!' }))
    })

});

// 新建博客
router.post('/new', function (req, res, next) {
    if (req.session.username) {
        req.body.realname = req.session.realname
        for (const key in req.body) {
            req.body[key] = xss(req.body[key])
        }
        newBlog(req.body).then(data => {
            res.json(new ResModels({ data, status: 200, message: 'OK!' }))
        }).catch(err => console.log(err))
    } else {
        res.json(new ResModels({ data: [], message: '未登录！', status: 403 }))
    }
});

// 更新博客
router.post('/update', function (req, res, next) {
    if (req.session.username) {
        for (const key in req.body) {
            req.body[key] = xss(req.body[key])
        }
        updateBlog(req.body).then(data => {
            res.json(new ResModels({ data, status: 200, message: 'OK!' }))
        }).catch(err => console.log(err)
        )
    } else {
        res.json(new ResModels({ data: [], message: '未登录！', status: 403 }))
    }
});

// 删除博客
router.post('/delete', function (req, res, next) {
    if (req.session.username) {
        delBlog(req.body.id, req.session.realname).then(data => {
            res.json(new ResModels({ data, status: 200, message: 'OK!' }))
        }).catch(err => res.json(new ResModels({ data: [], message: '参数不匹配！', status: 400 })))
    } else {
        res.json(new ResModels({ data: [], message: '未登录！', status: 403 }))
    }
});

module.exports = router;