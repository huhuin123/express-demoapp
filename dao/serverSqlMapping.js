// dao/appSqlMapping.js
// CRUD SQL语句

var server = {
    insert: 'INSERT INTO server(server_id, server_name,server_status,server_app_id,server_fw_main_id,server_fw_backup_id) VALUES(0,?,?)；INSERT INTO address_pool(add_id,add_ip,add_pooltype,add_status,) VALUES(0,add_ip,add_pooltype',
    delete:'delete from application where app_id=?',
    update:'update application set app_name=?, app_manager_name=?, app_manager_tel=?, app_status=?, app_ext=? where app_id=?',        
    queryByAppName: 'select * from application where app_name=?',    
    queryByManagerName: 'select * from application where app_manager_name=?',
    queryAll: 'SELECT server.server_id,server.server_name,GROUP_CONCAT(a.add_pooltype) AS pooltype,GROUP_CONCAT(a.add_ip) AS ip,application.app_name,any_value(a.mainFW) AS mainFW,any_value(firewall.fw_name) AS backFW,host.host_ip,server.server_ext FROM(SELECT firewall.fw_name AS mainFW,address_pool.add_fw_backup_id AS backupFWId,address_pool.add_pooltype,address_pool.add_ip,address_pool.add_server_id,firewall.fw_id FROM address_pool,firewall WHERE address_pool.add_fw_main_id = firewall.fw_id) AS a,firewall,server,host,application WHERE (a.backupFWId = firewall.fw_id AND server.server_host_id = host.host_id AND server.server_id = a.add_server_id AND application.app_id = server.server_app_id) GROUP BY server_id'
};

module.exports = server;