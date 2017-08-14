var express = require('express');
var router = express.Router();

var addressDao = require('../dao/addressDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.render('updateUser');
});


// 增加地址
//TODO 同时支持get,post
router.get('/addAddress', function(req, res, next) {
    addressDao.add(req, res, next);
});

//根据管理员名字查询
router.get('/queryByManagerName', function(req, res, next) {
    //console.log('查询所有application');
    applicationDao.queryByManagerName(req, res, next);
});

//查询全部地址
router.get('/queryAll', function(req, res, next) {
    addressDao.queryAll(req, res, next);
});

//根据状态和地址类型查询
router.get('/queryByTypeAndStatus', function(req, res, next) {
    addressDao.queryByTypeAndStatus(req, res, next);
});

//根据应用名称查询
router.get('/queryByAppName', function(req, res, next) {
    applicationDao.queryByAppName(req, res, next);
});

//删除地址
router.get('/deleteAddress', function(req, res, next) {
    addressDao.delete(req, res, next);
});

router.post('/updateAddress', function(req, res, next) {
    addressDao.update(req, res, next);
});

module.exports = router;

