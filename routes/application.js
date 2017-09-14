var express = require('express');
var router = express.Router();

var applicationDao = require('../dao/applicationDao');

// GET /apps 列表（分页 或 不分页）
router.get('/', function (req, res, next) {
    applicationDao.search(req, res, next)
});

// GET /apps/:id 查询单个应用实体
router.get(/\/\d+/, function (req, res, next) {
    var id = req.path.split('/').pop();
    applicationDao.queryById(req, res, next, id)
});

// POST /apps/batch 批量操作某些实体集合的状态值
router.post('/batch', function (req, res, next) {
    applicationDao.batchModify(req, res, next);
});

// POST /apps 新建实体
router.post('/', function (req, res, next) {
    applicationDao.save(req, res, next);
});

// PUT /apps 修改实体
router.put(/\/\d+/, function (req, res, next) {
    var id = req.path.split('/').pop();
    applicationDao.save(req, res, next, id);
});

module.exports = router;
