const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcryptjs');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

exports.registerPartisipant = (req, res) => {
    try{
        const { iduser, idkonsul } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(iduser && idkonsul){
            Connection.query('INSERT INTO icare_consult_acc SET ?', {id: null, id_account: iduser, id_tipe_konsultasi: idkonsul, date_created: tanggal, time_created: waktu}, async (error, results) => {
                if(error){
                    console.log(error)
                } else {
                    res.status(201).json({
                        message: "User berhasil di daftarkan",
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
}

exports.deletePartisipant = (req, res) => {
    try{
        const { idconsultacc, idkonsul } = req.body;
        if(idconsultacc && idkonsul){
            Connection.query('DELETE FROM icare_consult_acc WHERE id = ?', [idconsultacc], async (error, results) => {
                if(error){
                    console.log(error)
                } else {
                    /** query berhasil */
                    res.status(200).json({
                        message: "User berhasil di hapus dari partisipant",
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
}