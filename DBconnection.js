const Mysql = require('mariadb');
const Dotenv = require("dotenv");
Dotenv.config({ path: './.env' });

let connection = Mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.getConnection(function(err) {
    if (err) throw err;
    console.log("Database connected!");
});

module.exports = connection;
