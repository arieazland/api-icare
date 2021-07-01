const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcryptjs');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

exports.registerJawab = (req, res) => {
    try{
        const { jawaban, idpertanyaan, iduser, idkonsul } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if( jawaban && idpertanyaan && iduser && idkonsul){
            var sql = "INSERT INTO icare_aassessment (id, id_account, id_pertanyaan, jawaban, date_created, time_created) VALUES ?";
            var value = [];
            for( var i = 0; i < jawaban.length; i++){
                value.push([null, iduser, idpertanyaan[i], jawaban[i], tanggal, waktu]);
            }
            Connection.query(sql, [value], async (error, results) => {
                if(error){
                    console.log(error) 
                } else {
                    /** Input jawaban berhasil */
                    res.status(201).json({
                        message: "Jawaban berhasil di simpan",
                        idkonsul
                    });
                }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch (error){
        console.log(error)
    }
};

exports.editJawab = (req, res) => {
    
};

exports.deleteJawab = (req, res) => {
    
};