const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

exports.registerSoal = (req, res) => {
    try{
        const { pertanyaan, idkonsul } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(pertanyaan && idkonsul){
            Connection.query('INSERT INTO icare_qassessment SET ?', {id: null, id_consult_type: idkonsul, pertanyaan: pertanyaan, date_created: tanggal, time_created: waktu }, async (error, results) =>{
                if(error){
                    console.log(error)
                } else {
                    /** Input Tipe Konsul berhasil */
                    res.status(201).json({
                        message: "Pertanyaan berhasil di buat",
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

exports.registerSoalmultiple = (req, res) => {
    try{
        const { pertanyaan, idkonsul } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(pertanyaan && idkonsul){
            var sql = "INSERT INTO icare_qassessment (id, id_consult_type, pertanyaan, date_created, time_created) VALUES ?";
            var value = [];
            for( var i = 0; i < pertanyaan.length; i++){
                value.push([null, idkonsul, pertanyaan[i], tanggal, waktu]);
            }
            Connection.query(sql, [value], async (error, results) => {
                if(error){
                    console.log(error) 
                } else {
                    /** Input pertanyaan berhasil */
                    res.status(201).json({
                        message: "Pertanyaan berhasil di buat",
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

exports.editSoal = (req, res) => {
    try{
        const { pertanyaan, id, idkonsul } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(pertanyaan && id && idkonsul){
            Connection.query('UPDATE icare_qassessment SET ? WHERE id = ?', [{pertanyaan: pertanyaan, date_updated: tanggal, time_updated: waktu}, id], async (error, results) =>{
                if(error){
                    console.log(error)
                } else {
                    /** Input Tipe Konsul berhasil */
                    res.status(200).json({
                        message: "Pertanyaan berhasil di ubah",
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

exports.deleteSoal = (req, res) => {
    try{
        const { id, idkonsul } = req.body;
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(id && idkonsul){
            Connection.query('UPDATE icare_qassessment SET ? WHERE id = ?', [{status: "hapus", date_updated: tanggal, time_updated: waktu}, id], async (error, results) =>{
                if(error){
                    console.log(error)
                } else {
                    /** Input Tipe Konsul berhasil */
                    res.status(200).json({
                        message: "Pertanyaan berhasil di hapus",
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