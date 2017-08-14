var express = require('express');
var router = express.Router();

var firewallDao = require('../dao/firewallDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.render('updateUser');
});


// 增加用户
//TODO 同时支持get,post
router.get('/addFirewall', function(req, res, next) {
    firewallDao.add(req, res, next);
});


router.get('/queryAll', function(req, res, next) {
    console.log('查询所有防火墙');
    firewallDao.queryAll(req, res, next);
});

router.get('/query', function(req, res, next) {
    firewallDao.queryById(req, res, next);
});

router.get('/deleteFirewall', function(req, res, next) {
    firewallDao.delete(req, res, next);
});

router.post('/updateFirewall', function(req, res, next) {
    firewallDao.update(req, res, next);
});

module.exports = router;

