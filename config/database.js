const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12292381',
    database: 'sql12292381',
    password: 'rCT4v1mTmv'
});

module.exports = pool.promise();
