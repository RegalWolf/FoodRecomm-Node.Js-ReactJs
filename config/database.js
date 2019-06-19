const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12292381',
    database: 'sql12292381',
    password: 'rCT4v1mTmv'
    // host: 'localhost',
    // user: 'root',
    // database: 'healthy_food',
    // password: ''
    // host: '103.129.220.6',
    // user: 'reactiv2_username',
    // database: 'reactiv2_healthy_food',
    // password: 'username_47'
});

module.exports = pool.promise();
