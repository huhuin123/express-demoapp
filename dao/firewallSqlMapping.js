// dao/firewallSqlMapping.js
// CRUD SQL语句
var firewall = {
    insert:'INSERT INTO firewall(fw_id, fw_name, fw_ip, fw_account, fw_psw, fw_location, fw_ext) VALUES(0,?,?,?,?,?,?)',
    update:'update firewall set fw_name=?, fw_ip=?, fw_account=?, fw_psw=?, fw_location=?, fw_ext=? where fw_id=?',
    delete:'delete from firewall where fw_id=?',
    queryAll:'select * from firewall',
    queryByName: 'SELECT * FROM firewall WHERE fw_name=?'
};

module.exports = firewall;