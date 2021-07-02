const Express = require("express");
const Mysql = require("mysql");
const Bcrypt = require("bcryptjs");
const Path = require("path");
const Dotenv = require("dotenv");

// Set Moment Format engine
const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

const app = Express();

var session = require("express-session");
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Dotenv.config({ path: './.env' });
// const Connection = require ("./DBConnection");

// Parse URL-encoded bodies (as sent by HTML Forms)
app.use(Express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API Clients)
app.use(Express.json());

/** define router */
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/konsul', require('./routes/konsul'));
app.use('/partisipant', require('./routes/partisipant'));
app.use('/soal', require('./routes/soal'));
app.use('/jawab', require('./routes/jawab'));
app.use('/kesimpulan', require('./routes/kesimpulan'));

let port = 8082;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
