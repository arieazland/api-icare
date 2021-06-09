const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

exports.registerKonsul = (req, res) => {
    try{
        const { nama, tanggal1, tanggal2 } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(nama && tanggal1 && tanggal2){
            Connection.query('INSERT INTO icare_consult_type SET ?', {id: null, nama: nama, start: tanggal1, 
                end: tanggal2, direct_consult: "y", repeat_consult: "y", event_consult: "y", status_consult: "aktif", 
                date_created: tanggal, time_created: waktu }, async (error, results) =>{
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
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch (err){
        console.log(error)
    }
}

exports.editKonsul = (req, res) => {
    try{
        const { id, nama, tanggal1, tanggal2 } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(id && nama && tanggal1 && tanggal2){
            Connection.query('UPDATE icare_consult_type SET ? WHERE id = ?', [{nama: nama, start: tanggal1, end: tanggal2, 
                date_updated: tanggal, time_updated: waktu}, id], async (error, results) =>{
                    if(error){
                        console.log(error)
                    } else {
                        /** Input Tipe Konsul berhasil */
                        res.status(200).json({
                            message: "Data konsultasi berhasil di ubah",
                        });
                    }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch (err){
        console.log(error)
    }
}

exports.deleteKonsul = (req, res) => {
    try{
        const { id } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(id){
            Connection.query('UPDATE icare_consult_type SET ? WHERE id = ?', [{status_consult: 'hapus', 
                date_updated: tanggal, time_updated: waktu}, id], async (error, results) =>{
                    if(error){
                        console.log(error)
                    } else {
                        /** Input Tipe Konsul berhasil */
                        res.status(200).json({
                            message: "Data konsultasi berhasil di hapus",
                        });
                    }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch (err){
        console.log(error)
    }
}