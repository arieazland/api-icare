const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcryptjs');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

exports.registrasiRating = async (req, res) => {
    const {rate, komentar, psikolog, peserta} = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(rate && psikolog && peserta){
        try{
            /** lakukan cek psikolog */
            const cek_psikolog = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM cdc_account WHERE id = ?", [psikolog], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })

            if(cek_psikolog.length > 0){
                /** cek peserta */
                const cek_peserta = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id FROM cdc_account WHERE id = ?", [peserta], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(cek_peserta.length > 0){
                    /** simpan ke database */
                    const save_rating = await new Promise((resolve, reject) => {
                        Connection.query("INSERT INTO icare_rating SET ?", {id: null, idpsikolog: psikolog, idpeserta: peserta, rate:rate, komentar: komentar, status: 'aktif', id_consult_type: '1', date_created: tanggal, time_created: waktu }, (error) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve("true")
                            }
                        })
                    })

                    if(save_rating === "true"){
                        /** Simpan URL Room berhasil */
                        res.status(200).json({
                            message: "Rating berhasil diberikan",
                        });
                    } else {
                        /** Gagal simpan URL Room */
                        throw new Error('Gagal memberikan rating');
                    }
                } else if(cek_peserta.length == 0){
                    /** Peserta tidak terdaftar */
                    throw new Error('Peserta tidak terdaftar');
                } else {
                    /** Gagal get data peserta */
                    throw new Error('Get data peserta gagal');
                }
                
            } else if(cek_psikolog.length === 0){
                /** Psikolog tidak terdaftar */
                throw new Error('Psikolog tidak terdaftar');
            } else {
                /** Gagal get data psikolog */
                throw new Error('Get data psikolog gagal');
            }
        } catch (e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    }else{
        /** Field tidak boleh kosong */
        res.status(403).json({
            message: "Harap pilih rating/bintang terlebih dahulu",
        });
    }
}