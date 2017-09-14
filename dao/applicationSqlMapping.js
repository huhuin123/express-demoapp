// dao/appSqlMapping.js
// CRUD SQL语句

var application = {
    search: 'select * from application where app_status=\'1\' and (app_name like ? or app_manager_name like ?) order by app_id desc limit ?,?',
    queryAll: 'select * from application where app_status=\'1\' and (app_name like ? or app_manager_name like ?) order by app_id desc',
    queryById: 'select * from application where ?',
    queryCount: 'select count(*) as count from application where app_status=\'1\' and (app_name like ? or app_manager_name like ?)',
    batchModify: 'update application set ? where app_id in(?)',
    queryByName: 'select * from application where ?',
    insert: 'INSERT INTO application(app_name,app_manager_name,app_manager_tel,app_ext,app_status) VALUES(?,?,?,?,?)',
    update:'update application set ? where app_id=?'
};

module.exports = application;