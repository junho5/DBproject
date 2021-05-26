const maria = require('mysql');
const conn = maria.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    port: 3306,
    user:'bc969c6beabaa9',
    password:'65029b1b',
    database:'heroku_d57af3a00f950b4',
    multipleStatements: true
});

module.exports = conn;