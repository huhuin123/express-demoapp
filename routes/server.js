var express = require('express');
var router = express.Router();

var serverDao = require('../dao/serverDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.render('updateUser');
});


// 增加服务
//TODO 同时支持get,post
router.get('/addServer', function(req, res, next) {
    serverDao.add(req, res, next);
});

//根据Server ID查询
router.get('/queryByServerID', function(req, res, next) {
    console.log('根据Server ID查询');
    serverDao.queryByServerID(req, res, next);
});

//查询所有server
router.get('/queryAll', function(req, res, next) {
    console.log('查询所有user');
    serverDao.queryAll(req, res, next);
});

//根据Server Name查询
router.get('/queryByServerName', function(req, res, next) {
    console.log('根据Server name查询');
    serverDao.queryByServerName(req, res, next);
});

//根据Server IP查询
router.get('/queryByServerIP', function(req, res, next) {
    console.log('根据Server IP查询');
    serverDao.queryByServerIP(req, res, next);
});

//根据Application Name查询
router.get('/queryByApplicationName', function(req, res, next) {
    console.log('根据App Name查询');
    serverDao.queryByApplicationName(req, res, next);
});

//根据fw Name查询
router.get('/queryByFirewallName', function(req, res, next) {
    console.log('根据fw name查询');
    serverDao.queryByFirewallName(req, res, next);
});

//根据host ip查询
router.get('/queryByHostIP', function(req, res, next) {
    console.log('根据host ip查询');
    serverDao.queryByHostIP(req, res, next);
});

//执行删除动作时，server status=0
router.get('/deleteServer', function(req, res, next) {
    serverDao.delete(req, res, next);
});

//更新server表
router.post('/updateServer', function(req, res, next) {
    serverDao.update(req, res, next);
});



// //根据管理员名字查询
// router.get('/queryByManagerName', function(req, res, next) {
//     //console.log('查询所有application');
//     applicationDao.queryByManagerName(req, res, next);
// });

// //根据应用名称查询
// router.get('/queryByAppName', function(req, res, next) {
//     applicationDao.queryByAppName(req, res, next);
// });

// router.get('/deleteApplication', function(req, res, next) {
//     applicationDao.delete(req, res, next);
// });

// router.post('/updateApplication', function(req, res, next) {
//     applicationDao.update(req, res, next);
// });

module.exports = router;

