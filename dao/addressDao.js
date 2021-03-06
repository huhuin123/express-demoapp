// dao/applicationDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./addressSqlMapping');

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
    //新增地址
    add: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            
            if(err) {
                console.log(err);
            }

            connection.query(
                $sql.queryByAddServerName,
                [param.add_server_name],
                function(err, result) {
                    if(err) {
                        console.log(err);
                    }

                    if (result.length > 0) {
                        var addServerID = result[0].server_id;
                        connection.query(
                            $sql.insert,
                            [param.add_ip, param.add_pooltype, param.add_status, addServerID, param.add_ext],
                            function(err, result) {
                                if (err) {
                                    console.log(err);
                                }

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
                    }
                }
            );
        });
    },
    //删除地址
    delete: function (req, res, next) {
        // delete by Id
        pool.getConnection(function(err, connection) {
            var id = +req.query.add_id;
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
        // 为了简单，要求同时传（add_id,add_ip,add_pooltype,add_status,server_name,add_ext）5个参数
        var param = req.body;
        if (
            param.add_ip == null || param.add_pooltype == null
            || param.add_status == null || param.server_name == null || param.add_id == null
        ) {
            jsonWrite(res, undefined);
            return;
        }
        pool.getConnection(function(err, connection) {
            connection.query(
                $sql.queryByAddServerName,
                [param.server_name],
                function(err, result) {
                    console.log(result)
                    if (result.length > 0) {
                        var addServerID = result[0].server_id;
                        connection.query(
                            $sql.update, 
                            [
                                param.add_ip, param.add_pooltype, param.add_status,
                                addServerID, param.add_ext, +param.add_id
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
                                //console.log(result);

                                connection.release();
                        });
                    }
                    else {
                        jsonWrite(res, undefined);
                        connection.release();
                    }
                }
            );
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

    //查询全部地址
    queryAll: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryAll, function(err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },

    //根据地址类型和状态查询
    queryByTypeAndStatus: function (req, res, next) {
        var query = req.query;
        console.log(query);
        pool.getConnection(function(err, connection) {
            connection.query(
                $sql.queryByTypeAndStatus,
                [query.add_status,query.add_pooltype],
                function(err, result) {
                    jsonWrite(res, result);
                    connection.release();
                }
            );
        });
    },
    
};




