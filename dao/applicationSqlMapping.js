// dao/appSqlMapping.js
// CRUD SQL语句

var application = {
    insert: 'INSERT INTO application(app_id, app_name,app_manager_name,app_manager_tel,app_status,app_ext) VALUES(0,?,?,?,?,?)',
    delete:'delete from application where app_id=?',
    update:'update application set app_name=?, app_manager_name=?, app_manager_tel=?, app_status=?, app_ext=? where app_id=?',        
    queryByAppName: 'select * from application where app_name=?',    
    queryByManagerName: 'select * from application where app_manager_name=?'
};

module.exports = application;