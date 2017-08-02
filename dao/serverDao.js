// dao/serverDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./serverSqlMapping');

// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
    add: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            console.log(param);
            if(err){
                console.log(err);
            }
            // 建立连接，向表中插入值
            // 'INSERT INTO server(server_id,server_name,server_app_id,server_ext) VALUES(0,?,?,?)',
            connection.query(
                $sql.insert,
                [param.server_name, param.server_app_id, param.server_ext],
                function(err, result) {
                    if(result) {
                        result = {
                            code: 200,
                            msg:'增加成功'
                        };    
                    }
                    // 以json形式，把操作结果返回给前台页面
                    jsonWrite(res, result);
                    // 释放连接 
                    connection.release();
                }
            );
            console.log(res);
        });
    },
    delete: function (req, res, next) {
        // delete by Id
        pool.getConnection(function(err, connection) {
            var id = +req.query.app_id;
            if(err){
                console.log(arguments);
            }
            connection.query($sql.delete, id, function(err, result) {
                if(result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg:'删除成功'
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        // update by id
        // 为了简单，要求同时传（app_id, app_name,app_manager_name,app_manager_tel,app_status,app_ext）6个参数
        var param = req.body;
        if (
            param.app_name == null || param.app_manager_name == null
            || param.app_manager_tel == null || param.app_status == null || param.app_id == null
        ) {
            jsonWrite(res, undefined);
            return;
        }

        pool.getConnection(function(err, connection) {
            connection.query(
                $sql.update, 
                [
                    param.app_name, param.app_manager_name, param.app_manager_tel,
                    param.app_status, param.app_ext, +param.app_id
                ], 
                function(err, result) {
                    console.log(err);
                    // 使用页面进行跳转提示
                    if(result.affectedRows > 0) {
                        res.render('suc', {
                            result: result
                        }); // 第二个参数可以直接在jade中使用
                    } else {
                        res.render('fail',  {
                            result: result
                        });
                    }
                    console.log(result);

                    connection.release();
            });
        });

    },
    queryByAppName: function (req, res, next) {
        var query = req.query;
        //var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryByAppName, query.app_name, function(err, result) {
                jsonWrite(res, result);
                connection.release();

            });
        });
    },
    queryByManagerName: function (req, res, next) {
        var query = req.query;
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryByManagerName, query.app_manager_name,function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    queryAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    }
    
    
};
