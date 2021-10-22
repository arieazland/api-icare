const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcryptjs');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

exports.registrasiRoom = async (req, res) => {
    const {namaroom, psikolog, urlroom} = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(namaroom && psikolog && urlroom){
        try{
            const customurlroom = urlroom.substr(8);
            const urlroomicare = 'https://care.imeet.id/videocallicare/'+customurlroom;

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
                /** simpan ke database */
                const save_url = await new Promise((resolve, reject) => {
                    Connection.query("INSERT INTO icare_roomvidcall SET ?", {id: null, idpsikolog: psikolog, nama_room: namaroom, url_room: urlroomicare, real_url_room: urlroom, status: 'aktif', date_created: tanggal, time_created: waktu }, async (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve("true")
                        }
                    })
                })

                if(save_url === "true"){
                    /** Simpan URL Room berhasil */
                    res.status(200).json({
                        message: "Create Room Berhasil",
                    });
                } else {
                    /** Gagal simpan URL Room */
                    throw new Error('Create Room gagal');
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
            message: "Field tidak boleh kosong",
        });
    }
}

exports.hapusRoom = async (req, res) => {
    const { id }  = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if( id ) {
        try{
            /** lakukan cek id */
            const cek_id = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM icare_roomvidcall WHERE id = ?", [id], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_id.length > 0){
                /** hapus room */
                const hapusroom = await new Promise((resolve, reject) => {
                    Connection.query("UPDATE icare_roomvidcall SET ? WHERE id = ?",[{status: 'hapus', date_updated: tanggal, time_updated: waktu}, id], async (error) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve("true")
                        }
                    })
                })
                if(hapusroom === "true"){
                    /** hapus room berhasil */
                    res.status(200).json({
                        message: "Room Berhasil Dihapus",
                    }); 
                } else {
                    /** send error */
                    throw new Error('Room Gagal Dihapus');
                }
            } else if(cek_id.length === 0){
                /** Room tidak terdaftar */
                throw new Error('Room tidak terdaftar');
            } else {
                /** Gagal get data list vidcall */
                throw new Error('Get data room gagal');
            }

        } catch (e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    }else{
        /** Field tidak boleh kosong */
        res.status(403).json({
            message: "Field tidak boleh kosong",
        });
    }
}