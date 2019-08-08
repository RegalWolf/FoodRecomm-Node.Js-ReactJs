const mysql = require('mysql2');

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'reactiv2_healthy_food',
    password: ''
});

if (process.env.NODE_ENV === 'production') {
    pool = mysql.createPool({
        host: '103.129.220.6',
        user: 'reactiv2_username',
        database: 'reactiv2_healthy_food',
        password: 'username_47'
        // host: 'us-cdbr-iron-east-02.cleardb.net',
        // user: 'b8517e415ed344',
        // database: 'heroku_98d1a407185b11a',
        // password: 'd1381104'
    });
}

module.exports = pool.promise();
