const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcryptjs');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
const { resolve } = require("path");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** Insert Acara Process */
exports.registrasiJawaban = async (req, res) => {
    const {iduser, idsoal, radio } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(iduser && idsoal && radio){
        try{
            /** pengecekkan kuota sesi */
            /** lakukan terlebih dahulu pengecekkan iduser dan idsoal */
            /** kemudian lakukan pengecekkan jawaban jika sudah ada jawaban atas ID user, ID soal dan ID acara tsb, */
            /** di lanjutkan ke part selanjutnya */
            /** jika belum ada dilakukan penyimpanan jawaban dan kirim notif jawaban berhasil di simpan */

            /** lakukan cek iduser */
            const cek_user = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM cdc_account WHERE id = ?", [iduser], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })

            if(cek_user.length > 0){
                /** jika data user terdaftar lakukan pengecekkan idsoal */
                var sql_ceksoal = "SELECT id FROM t_soal WHERE id IN (?)";
                var value_ceksoal = [];
                for( var i = 0; i < idsoal.length; i++){
                    value_ceksoal.push([idsoal[i]]);
                }
                const cek_soal = await new Promise((resolve, reject) => {
                    Connection.query(sql_ceksoal, [value_ceksoal], (error,results) => {
                        if(error) { 
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                })

                if(cek_soal.length !== idsoal.length){
                    /** jika data soal tidak terdaftar */
                    throw new Error('Soal tidak terdaftar'); 
                } else if(cek_soal.length === idsoal.length){
                    /** jika data soal terdaftar sama dengan jumlah soal lakukan pengecekkan */
                    /** apakah user sudah menjawab pertanyaan pada part dan acara terpilih */
                    var sql_cekjawaban = "SELECT id FROM t_answer WHERE idsoal IN (?) AND iduser = ? AND idacara = 3";
                    var value_cekjawaban = [];
                    for( var i = 0; i < idsoal.length; i++){
                        value_cekjawaban.push([idsoal[i]]);
                    }
                    const cek_jawaban = await new Promise((resolve, reject) => {
                        Connection.query(sql_cekjawaban, [value_cekjawaban, iduser], (error,results) => {
                            if(error) { 
                                reject(error);
                            } else {
                                resolve(results);
                            }
                        });
                    })

                    if(cek_jawaban.length === 0){
                        /** user belum menjawab, lakukan penyimpanan */
                        var sql_simpanjawaban = "INSERT INTO t_answer (id, iduser, idsoal, jawab, idacara, date_created, time_created) VALUES ?";
                        var value_simpanjawaban = [];
                        for( var i = 0; i < idsoal.length; i++){
                            value_simpanjawaban.push([null, iduser, idsoal[i], radio[i], '3', tanggal, waktu]);
                        }
                    
                        const simpan_jawaban = await new Promise((resolve, reject) => {
                            Connection.query(sql_simpanjawaban, [value_simpanjawaban], (error) => {
                                if(error) { 
                                    reject(error);
                                } else {
                                    resolve("true");
                                }
                            });
                        })

                        if (simpan_jawaban === "true") {
                            /** simpan jawaban */
                            res.status(201).json({
                                message: "Jawaban berhasil disimpan, silahkan melanjutkan"
                            });
                        } else {
                            /** jawaban gagal disimpan */
                            throw new Error('Jawaban gagal disimpan');
                        }
                    } else if(cek_jawaban.length > 0){
                        /** user sudah menjawab, abaikan jawaban terbaru */
                        throw new Error('Silahkan lanjutkan menjawab pertanyaan');
                    } else {
                        /** jika ada error lain */
                        throw new Error('Error, please contact developer');
                    }
                } else {
                    /** jika data soal tidak terdaftar */
                    throw new Error('Soal tidak terdaftar');    
                }
            } else {
                /** jika data user tidak terdaftar */
                throw new Error('User tidak terdaftar');
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** Field tidak boleh kosong */
        res.status(403).json({
            message: "Field tidak boleh kosong",
        });
    }
}