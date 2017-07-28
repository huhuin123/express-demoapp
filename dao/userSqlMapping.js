// dao/userSqlMapping.js
// CRUD SQL语句
var firewall = {
    insert:'INSERT INTO firewall(fw_id, fw_name, fw_ip, fw_account, fw_psw, fw_location, fw_ext) VALUES(0,?,?,?,?,?,?)'
    update:'update firewall set fw_account=?, fw_psw=?, fw_location=?, fw_ext=? where id=?'
};

module.exports = firewall;