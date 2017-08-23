var express = require('express');
var router = express.Router();

var applicationDao = require('../dao/applicationDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.render('updateUser');
});


// 增加用户
//TODO 同时支持get,post
router.get('/addApplication', function(req, res, next) {
    applicationDao.add(req, res, next);
});

//根据管理员名字查询
router.get('/queryByManagerName', function(req, res, next) {
    //console.log('查询所有application');
    applicationDao.queryByManagerName(req, res, next);
});

//根据应用名称查询
router.get('/queryByAppName', function(req, res, next) {
    applicationDao.queryByAppName(req, res, next);
});

//查询全部应用
router.get('/queryAll', function(req, res, next) {
    applicationDao.queryAll(req, res, next);
});

router.get('/deleteApplication', function(req, res, next) {
    applicationDao.delete(req, res, next);
});

router.post('/updateApplication', function(req, res, next) {
    applicationDao.update(req, res, next);
});

module.exports = router;

