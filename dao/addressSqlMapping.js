// dao/addressSqlMapping.js
// CRUD SQL语句

var address = {
    queryByAddServerName:'select server_id from server where server_name=?',
    insert:'INSERT INTO address_pool(add_id,add_ip,add_pooltype,add_status,add_server_id,add_ext) VALUES(0,?,?,?,?,?)',
    delete:'delete from address_pool where add_id=?',
    update:'update address_pool set add_ip=?, add_pooltype=?, add_status=?, add_server_id=?, add_ext=? where add_id=?',        
    queryByAppName: 'select * from application where app_name=?',    
    queryByManagerName: 'select * from application where app_manager_name=?',
    queryAll:'SELECT a.add_id,a.add_ip,a.add_pooltype,server.server_name,a.add_status,firewall.fw_name AS mainFW,a.backupFW,a.add_ext FROM (SELECT address_pool.add_id,address_pool.add_ip,address_pool.add_pooltype,address_pool.add_status,address_pool.add_ext,address_pool.add_server_id,firewall.fw_name AS backupFW,address_pool.add_fw_main_id AS mainFWId FROM firewall,address_pool WHERE firewall.fw_id = address_pool.add_fw_backup_id) AS a,server,firewall WHERE (a.mainFWId = firewall.fw_id AND a.add_server_id = server.server_id)',
    queryByTypeAndStatus: 'SELECT a.add_id,a.add_ip,a.add_pooltype,server.server_name,a.add_status,firewall.fw_name AS mainFW,a.backupFW,a.add_ext FROM (SELECT address_pool.add_id,address_pool.add_ip,address_pool.add_pooltype,address_pool.add_status,address_pool.add_ext,address_pool.add_server_id,firewall.fw_name AS backupFW,address_pool.add_fw_main_id AS mainFWId FROM firewall,address_pool WHERE firewall.fw_id = address_pool.add_fw_backup_id) AS a,server,firewall WHERE(a.mainFWId = firewall.fw_id AND a.add_server_id = server.server_id AND add_status=? and add_pooltype=?)'

};

module.exports = address;