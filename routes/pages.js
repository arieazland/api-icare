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
    res.send("Hello, welcome to API-ICare Page");
});

Router.get('/userlist', (req, res) =>{
    Connection.query("SELECT * FROM icare_account", async (error, results) =>{
        if(error){ 
            throw error; 
        } else if(results.length > 0){
            /** Kirim data user */
            res.status(201).json({
                data: results
            });
        } else if(results.length = 0){
            /** Data user kosong */
            res.status(500).json({
                message: 'Data user kosong'
            })
        }
    });
})

module.exports = Router;