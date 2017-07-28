// conf/db.js
// MySQL数据库联接配置
module.exports = {
    mysql: {
        host: '127.0.0.1', 
        user: 'root',
        password: 'hhn123456',
        database:'iptables', // 前面建的iptale表位于些数据库中
        port: 3306
    }
};
