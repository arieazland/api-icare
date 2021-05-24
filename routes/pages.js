const Express = require("express");
const Router = Express.Router();
const Dotenv = require("dotenv");
// Set Moment Format engine
const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

/** Route for Register */
Router.get('/', (req, res) => {
    res.send("Hello");
});

Router.post('/registeradmin', (req, res) => {
    const { email, nama, password, password2 } = req.body;
    res.status(201).json({
        message: "berhasil",
        email: email,
        nama: nama,
        password: password
    })
})

module.exports = Router;