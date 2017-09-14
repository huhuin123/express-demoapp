// dao/applicationDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./applicationSqlMapping');
var u = require('underscore');

// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

var listJsonWrite = function (res, ret, totalCount) {
    if (typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    }
    else {
        var results = u.map(
            ret,
            function (item) {
                return {
                    id: item.app_id,
                    name: item.app_name,
                    status: item.app_status,
                    managerName: item.app_manager_name,
                    managerTel: item.app_manager_tel,
                    description: item.app_ext
                }
            }
        );
        jsonWrite(
            res,
            {
                totalCount: totalCount,
                results: results
            }
        );
    }
};

var entityJsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    }
    else {
        var result = u.map(
            ret,
            function (item) {
                return {
                    id: item.app_id,
                    name: item.app_name,
                    status: item.app_status,
                    managerName: item.app_manager_name,
                    managerTel: item.app_manager_tel,
                    description: item.app_ext
                }
            }
        );
        jsonWrite(
            res,
            result[0]
        );
    }
};

module.exports = {
    /**
     * 分页列表，带搜索功能
     * 请求参数
     *    pageNo 页码，默认null，如不传pageNo，则返回全部列表结果
     *    pageSize 每页数量，可选，默认‘15’
     *    keyword 搜索关键词，默认''
     */
    search: function (req, res, next) {
        var params = req.query || req.params;
        var keyword = params.keyword || '';
        keyword = '%' + keyword + '%';
        var pageNo = params.pageNo || null;
        var pageSize = params.pageSize || '15';
        var pageStart = 0;

        if (pageNo) {
            pageStart = (+pageNo - 1) * +pageSize;
        }

        pool.getConnection(
            function (err, connection) {
                if (err){
                    console.log(err);
                }

                connection.query(
                    $sql.queryCount,
                    [keyword, keyword],
                    function (err, results) {
                        if (err) {
                            console.log(err);
                        }

                        var totalCount = results[0].count;

                        if (pageNo) {
                            connection.query(
                                $sql.search,
                                [keyword, keyword, pageStart, +pageSize],
                                function (err, results) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    if (results) {
                                        listJsonWrite(res, results, totalCount);
                                        connection.release();
                                    }
                                }
                            );
                        }
                        else {
                            pool.getConnection(function(err, connection) {
                                connection.query(
                                    $sql.queryAll,
                                    [keyword, keyword],
                                    function(err, results) {
                                        if (results) {
                                            listJsonWrite(res, results, totalCount);
                                            connection.release();
                                        }
                                    }
                                );
                            });
                        }
                    }
                )
            }
        );
    },

    /**
     * 不分页列表，一次性获取全部结果
     */
    queryAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    /**
     * 根据路径ID查询单个实体信息
     */
    queryById: function (req, res, next, id) {
        pool.getConnection(function(err, connection) {
            connection.query(
                $sql.queryById,
                {app_id: id},
                function(err, result) {
                    entityJsonWrite(res, result);
                    connection.release();
                }
            );
        });
    },

    /**
     * 批量操作实体集合的状态值
     * 请求参数
     *    ids 实体集合的ID数组
     *    status 目标状态值，目前仅有 0:删除
     */
    batchModify: function (req, res, next) {
        var params = req.body;
        var ids = params.ids;
        var status = '' + params.status;

        pool.getConnection(function(err, connection) {
            connection.query(
                $sql.batchModify,
                [{app_status: status}, ids],
                function(err, result) {
                    jsonWrite(
                        res,
                        {
                            ids: ids,
                            status: status
                        }
                    );
                    connection.release();
                }
            );
        });
    },

    /**
     * 新增实体
     * 请求参数
     *    name 应用名称，字符串，不可重名
     *    managerName 管理员姓名，字符串
     *    managerTel 管理员电话，字符串
     *    description 备注信息，字符串
     */
    save: function (req, res, next, id) {
        var params = req.body;
        var name = params.name;

        pool.getConnection(function (err, connection) {
            connection.query(
                $sql.queryByName,
                {app_name: name},
                function (err, result) {
                    console.log(result)
                    if (!id && result && result.length) {
                        jsonWrite(
                            res.status(409),
                            {
                                errorId: 409,
                                field: 'name',
                                message: '已存在相同名称的应用'
                            }
                        );
                    }
                    else {
                        var sqlString = $sql.insert;
                        var values = [name, params.managerName, params.managerTel, params.description, '1']
                        if (id) {
                            sqlString = $sql.update;
                            values = [
                                {
                                    app_name: params.name,
                                    app_manager_name: params.managerName,
                                    app_manager_tel: params.managerTel,
                                    app_ext: params.description
                                },
                                id
                            ];
                        }
                        connection.query(
                            sqlString,
                            values,
                            function (err, result) {
                                if (err) {
                                    jsonWrite(
                                        res.status(500),
                                        err
                                    );
                                }
                                else {
                                    var statusCode = id ? 200 : 201;
                                    jsonWrite(
                                        res.status(statusCode),
                                        result
                                    );
                                }
                            }
                        );
                    }
                    connection.release();
                }
            );
        });
    }
};
