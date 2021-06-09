const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");
const { start } = require("repl");

exports.registerKonsul = (req, res) => {
    try{
        const { nama, tanggalmulai, tanggalakhir } = req.body;

        if(nama & tanggalmulai & tanggalakhir){
            Connection.query('INSERT INTO icare_consult_type SET ?', {id: null, nama: nama, start: tanggalmulai, 
                end: tanggalakhir, direct_consult: "y", repeat_consult: "y", event_consult: "y", status_consult: "aktif" }, async (error, results) =>{
                    if(error){
                        console.log(error)
                    } else {
                        /** Input Tipe Konsul berhasil */
                        res.status(201).json({
                            message: "Konsultasi berhasil di buat",
                        });
                    }
            })
        } else {

        }
    } catch (err){

    }
}

exports.editKonsul = (req, res) => {
    
}

exports.deleteKonsul = (req, res) => {
    
}