const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcryptjs');
// Set Moment Format engine
const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

/** Simpan Process */
exports.tambah = async (req, res) => {
    try {
        /** Cek session login */
        if(req.session.loggedIn){
            /** get data dari form input acara */
            const { namatamu, alamattamu, keterangantamu, idacaratambah } = req.body;
            /** query insert data acara ke database */
            Connection.query("INSERT INTO tb_tamu SET ?", {id_tamu: null, id_acara: idacaratambah, nama_tamu: namatamu, alamat_tamu: alamattamu, keterangan_tamu: keterangantamu, status_tamuaktif: '1'}, (error, results) => {
                if(error){
                    /** jika error di tampilkan error log */
                    console.log(error)
                } else {
                    /** Query get data tamu dari acara yang dipilih */
                    Connection.query("SELECT t.*, a.nama_acara FROM tb_tamu t, tb_acara a WHERE a.id_acara = t.id_acara AND a.id_acara = ? AND t.status_tamuaktif = 1 AND a.status_acaraaktif = 1 ORDER BY t.nama_tamu ASC", [idacaratambah], async (error, results) => {
                        if(error){
                            /** jika error di tampilkan error log */
                            console.log(error)
                        } else {
                            /** jika tidak error lakukan query get list acara */
                            Connection.query("SELECT * FROM tb_acara WHERE status_acaraaktif = 1 ORDER BY nama_acara ASC", (error, resultsAcara) => {
                                if (error) {
                                    /** jika error di tampilkan error log */
                                    console.log(error);
                                } else {
                                    /** jika tidak error lakukan query get data acara terpilih */
                                    Connection.query("SELECT id_acara, nama_acara FROM tb_acara WHERE id_acara = ? AND status_acaraaktif = 1", [idacaratambah], async (error, namaacara) => {
                                        if (error) {
                                            /** jika error di tampilkan error log */
                                            console.log(error);
                                        } else {
                                            /** Jika tidak error response di kembalikan ke halaman tamu*/
                                            req.session.sessionFlash2 = {
                                                type: 'success',
                                                message: 'Input Data Tamu Berhasil!'
                                            }
                                            sessionFlash2 = req.session.sessionFlash2;
                                            username = req.session.username;
                                            nama = req.session.nama;
                                            pilihacara = idacaratambah;
                                            res.render('tamu', {
                                                nama, username, results, pilihacara, resultsAcara, namaacara, sessionFlash2
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            /** Jika belum login di alihkan ke halaman login */
            res.redirect("/login");
        }
    } catch (error) {
            console.log(error);
    }; 
};

/** Ubah Process */
exports.ubah = (req, res) => {
    try {
        /** Cek session login */
        if(req.session.loggedIn){
            /** get data dari form input acara */
            const { modalnamatamu, modalalamattamu, modalketerangantamu, modalidtamu, modalidacara } = req.body;
            /** query insert data acara ke database */
            Connection.query("UPDATE tb_tamu SET ? WHERE id_tamu = ? AND id_acara = ?", [{nama_tamu: modalnamatamu, alamat_tamu: modalalamattamu, keterangan_tamu: modalketerangantamu}, modalidtamu, modalidacara], (error) => {
                if(error){
                    /** jika error di tampilkan error log */
                    console.log(error)
                } else {
                    /** Query get data tamu dari acara yang dipilih */
                    Connection.query("SELECT t.*, a.nama_acara FROM tb_tamu t, tb_acara a WHERE a.id_acara = t.id_acara AND a.id_acara = ? AND t.status_tamuaktif = 1 AND a.status_acaraaktif = 1 ORDER BY t.nama_tamu ASC", [modalidacara], async (error, results) => {
                        if(error){
                            /** jika error di tampilkan error log */
                            console.log(error)
                        } else {
                            /** jika tidak error lakukan query get list acara */
                            Connection.query("SELECT * FROM tb_acara WHERE status_acaraaktif = 1 ORDER BY nama_acara ASC", (error, resultsAcara) => {
                                if (error) {
                                    /** jika error di tampilkan error log */
                                    console.log(error);
                                } else {
                                    /** jika tidak error lakukan query get data acara terpilih */
                                    Connection.query("SELECT id_acara, nama_acara FROM tb_acara WHERE id_acara = ? AND status_acaraaktif = 1", [modalidacara], async (error, namaacara) => {
                                        if (error) {
                                            /** jika error di tampilkan error log */
                                            console.log(error);
                                        } else {
                                            /** Jika tidak error response di kembalikan ke halaman tamu*/
                                            req.session.sessionFlash2 = {
                                                type: 'success',
                                                message: 'Ubah Data Tamu Berhasil!'
                                            }
                                            sessionFlash2 = req.session.sessionFlash2;
                                            username = req.session.username;
                                            nama = req.session.nama;
                                            pilihacara = modalidacara;
                                            res.render('tamu', {
                                                nama, username, results, pilihacara, resultsAcara, namaacara, sessionFlash2
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            /** Jika belum login di alihkan ke halaman login */
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
    };
};

/** Hapus Process */
exports.hapus = (req, res) => {
    try {
        /** Cek session login */
        if(req.session.loggedIn){
            /** get data dari form input acara */
            const { modalidtamuhapus, modalidacarahapus } = req.body;
            /** query insert data acara ke database */
            Connection.query("UPDATE tb_tamu SET ? WHERE id_tamu = ? AND id_acara = ?", [{status_tamuaktif: '0'}, modalidtamuhapus, modalidacarahapus], (error) => {
                if(error){
                    /** jika error di tampilkan error log */
                    console.log(error)
                } else {
                    /** Query get data tamu dari acara yang dipilih */
                    Connection.query("SELECT t.*, a.nama_acara FROM tb_tamu t, tb_acara a WHERE a.id_acara = t.id_acara AND a.id_acara = ? AND t.status_tamuaktif = 1 AND a.status_acaraaktif = 1 ORDER BY t.nama_tamu ASC", [modalidacarahapus], async (error, results) => {
                        if(error){
                            /** jika error di tampilkan error log */
                            console.log(error)
                        } else {
                            /** jika tidak error lakukan query get list acara */
                            Connection.query("SELECT * FROM tb_acara WHERE status_acaraaktif = 1 ORDER BY nama_acara ASC", (error, resultsAcara) => {
                                if (error) {
                                    /** jika error di tampilkan error log */
                                    console.log(error);
                                } else {
                                    /** jika tidak error lakukan query get data acara terpilih */
                                    Connection.query("SELECT id_acara, nama_acara FROM tb_acara WHERE id_acara = ? AND status_acaraaktif = 1", [modalidacarahapus], async (error, namaacara) => {
                                        if (error) {
                                            /** jika error di tampilkan error log */
                                            console.log(error);
                                        } else {
                                            /** Jika tidak error response di kembalikan ke halaman tamu*/
                                            req.session.sessionFlash2 = {
                                                type: 'success',
                                                message: 'Hapus Data Tamu Berhasil!'
                                            }
                                            sessionFlash2 = req.session.sessionFlash2;
                                            username = req.session.username;
                                            nama = req.session.nama;
                                            pilihacara = modalidacarahapus;
                                            res.render('tamu', {
                                                nama, username, results, pilihacara, resultsAcara, namaacara, sessionFlash2
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            /** Jika belum login di alihkan ke halaman login */
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
    };
};

/** proses kehadiran tamu */
exports.kehadiran = (req, res) => {
    try {
        /** get data dari form input acara */
        const { idtamukehadiran, idacarakehadiran } = req.body;
        var timenow = Moment().format("HH:mm:ss");
        /** Cek isi form */
        if(idtamukehadiran == "-- Pilih/Ketikkan Nama Anda --"){
            /** Jika true  response di kembalikan ke halaman pencarian tamu dengan notifikasi error*/
            req.session.sessionFlash = {
                type: 'error',
                message: 'Harap Cari/Ketikkan Nama Anda Terlebih Dahulu!'
            }
            res.redirect("/pencariantamu/"+idacarakehadiran);
        } else{
            /** query insert data acara ke database */
            Connection.query("INSERT INTO tb_kehadiran SET ?", {id_kehadiran: null, id_tamu: idtamukehadiran, id_acara: idacarakehadiran, waktu_kehadiran: timenow}, async (error) => {
                if(error){
                    /** jika error di tampilkan error log */
                    console.log(error);
                } else {
                    /** query update status acara ke database */
                    Connection.query("UPDATE tb_acara SET ? WHERE id_acara = ?", [{status_acara: "Sudah Terlaksana"}, idacarakehadiran], async (error) =>{
                        if(error){
                            console.log(error);
                        } else{
                            /** Jika tidak error response di kembalikan ke halaman pencarian tamu dengan notifikasi berhasil*/
                            req.session.sessionFlash2 = {
                                type: 'success',
                                message: 'Tamu Terkonfirmasi Hadir!'
                            }
                            res.redirect("/pencariantamu/"+idacarakehadiran);
                        }
                    });
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}