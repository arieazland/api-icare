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
    res.send("Hello, welcome to API-ICare Page")
})

Router.get('/userlist', (req, res) =>{
    Connection.query("SELECT * FROM icare_account WHERE NOT account_type = 'nonaktif'  ORDER BY nama ASC", async (error, results) =>{
        if(error){ 
            res.status(500).json({
                message: 'Get data users error'
            })
        } else if(results.length >= 0){
            /** Kirim data user */
            res.status(201).json({
                data: results
            })
        }
    })
})

Router.get('/konsullist', (req, res) => {
    Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, results) => {
        if(error){
            res.status(500).json({
                message: 'Get data konsul error'
            })
        } else if(results.length >= 0){
            /** Kirim data event */
            res.status(201).json({
                data: results
            })
        }
    })
})

module.exports = Router;