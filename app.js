const Express = require("express");
const Mysql = require("mysql");
const Bcrypt = require("bcrypt");
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

Dotenv.config({ path: './.env' });
const Connection = require ("./DBConnection");

// Parse URL-encoded bodies (as sent by HTML Forms)
app.use(Express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API Clients)
app.use(Express.json());

/** define router */
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
// app.use('/kelolaacara', require('./routes/kelolaacara'));
// app.use('/kelolatamu', require('./routes/kelolatamu'));
// app.use('/post', require('./routes/post'));

/** router for index */
// app.get('/', (req, res) => {
//     res.render('index');
// });

let port = process.env.DB_PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});