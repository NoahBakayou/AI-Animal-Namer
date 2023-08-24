const mysql = require('mysql');
const conn = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "", //keep empty won't work with 1234 entered
 database: "AnimalNamer",
 multipleStatements: true //not having multipleStatements is more secure. ex dog', ''); UPDATE animals SET status = 'X'; #

});

conn.connect();

module.exports = conn;