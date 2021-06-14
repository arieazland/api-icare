const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

exports.registerJawab = (req, res) => {
    
};

exports.registerJawabmultiple = (req, res) => {
    
};

exports.editJawab = (req, res) => {
    
};

exports.deleteJawab = (req, res) => {
    
};