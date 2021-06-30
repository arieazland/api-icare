const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
const { CONNREFUSED } = require("dns");
const { resume } = require("../DBconnection");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

exports.registerKesimpulan = (req, res) => {
    try{
        const { selectkonsul, selectpeserta, idpsikolog, kesimpulan } = req.body
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(selectkonsul && selectpeserta && idpsikolog && kesimpulan){
            /** cek konsul */
            Connection.query("SELECT id FROM icare_consult_type WHERE id = ? AND NOT status_consult = 'hapus'", [selectkonsul], async (error, cekkonsul) => {
                if(error){
                    /** get cek konsul error */
                    res.status(500).json({
                        message: "Cek data konsultasi error",
                    });
                } else if(cekkonsul.length == 0){
                    /** data konsul tidak ada */
                    res.status(403).json({
                        message: "Tipe konsultasi tidak terdaftar",
                    });
                } else if(cekkonsul.length > 0){
                    /** cek peserta */
                    Connection.query("SELECT id FROM icare_account WHERE id = ? AND (account_type = 'peserta' OR account_type = 'peserta_event')", [selectpeserta], async (error, cekpeserta) => {
                        if(error){
                            /** get cek peserta error */
                            res.status(500).json({
                                message: "Cek data peserta error",
                            });
                        } else if(cekpeserta.length == 0){
                            /** data peserta tidak ada */
                            res.status(403).json({
                                message: "Peserta tidak terdaftar",
                            });                            
                        } else if(cekpeserta.length > 0){
                            /** cek psikolog */
                            Connection.query("SELECT id FROM icare_account WHERE id = ? AND ((account_type = 'psikologis' OR account_type = 'konsultan')OR account_type = 'admin')", [idpsikolog], async (error, cekpsikolog) => {
                                if(error){
                                    /** get cek psikolog error */
                                    res.status(500).json({
                                        message: "Cek data psikolog error",
                                    });
                                } else if(cekpsikolog.length == 0){             
                                    /** data psikolog tidak ada */
                                    res.status(403).json({
                                        message: "Psikolog tidak terdaftar",
                                    }); 
                                } else if(cekpsikolog.length > 0){
                                    /** cek kesimpualn sudah ada atau belum */
                                    Connection.query("SELECT * FROM icare_conc WHERE id_consult_type = ? AND id_account = ?", [selectkonsul, selectpeserta], async (error, cekkesimpulan) => {
                                        if(error){
                                            /** get cek kesimpulan error */
                                            res.status(500).json({
                                                message: "Cek data kesimpulan error",
                                            });
                                        } else if(cekkesimpulan.length == 0) {
                                            /** input data kesimpulan */
                                            Connection.query("INSERT INTO icare_conc SET ?", {id: null, id_consult_type: selectkonsul, id_account: selectpeserta, conc: kesimpulan, verified_by: idpsikolog, status: 'aktif', date_created: tanggal, time_created: waktu }, async (error, results) => {
                                                if(error){
                                                    /** insert kesimpulan error */
                                                    res.status(500).json({
                                                        message: "Input kesimpulan error",
                                                    });
                                                } else {
                                                    /** insert kesimpulan berhasil */
                                                    res.status(200).json({
                                                        message: "Kesimpulan berhasil disimpan",
                                                        selectkonsul
                                                    });
                                                }
                                            })
                                        } else if(cekkesimpulan.length > 0) {
                                            /** get cek kesimpulan error */
                                            res.status(403).json({
                                                message: "Kesimpulan sudah ada",
                                            });
                                        } else {
                                            /** get cek kesimpulan error */
                                            res.status(500).json({
                                                message: "Cek data kesimpulan error",
                                            });
                                        }
                                    })
                                } else {
                                    /** get cek peserta error */
                                    res.status(403).json({
                                        message: "Cek data psikolog error",
                                    });
                                }
                            })
                        } else {
                            /** get cek peserta error */
                            res.status(403).json({
                                message: "Cek data peserta error",
                            });
                        }
                    })
                } else {
                    /** get cek konsul error */
                    res.status(403).json({
                        message: "Cek data konsultasi error",
                    });
                }
            })
        } else {
            /** try error */
            res.status(403).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch(error) {
        /** try error */
        res.status(500).json({
            message: "Try get data error",
        });
    }
}

exports.editKesimpulan = (req, res) => {
    try{
        const { idkesimpulan, selectkonsul, selectpeserta, idpsikolog, kesimpulan } = req.body
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(idkesimpulan && selectkonsul && selectpeserta && idpsikolog && kesimpulan){
            Connection.query("SELECT * FROM icare_conc WHERE id = ? AND id_consult_type = ? AND id_account = ?", [idkesimpulan, selectkonsul, selectpeserta], async (error, cekkesimpulan) => {
                if(error) {
                    /** get cek kesimpulan error */
                    res.status(500).json({
                        message: "Cek data kesimpulan error",
                    });
                } else if(cekkesimpulan.length == 0){
                    /** kesimpulan tidak terdaftar */
                    res.status(403).json({
                        message: "Kesimpulan tidak terdaftar",
                    });
                } else if(cekkesimpulan.length > 0){
                    /** cek konsul */
                    Connection.query("SELECT id FROM icare_consult_type WHERE id = ? AND NOT status_consult = 'hapus'", [selectkonsul], async (error, cekkonsul) => {
                        if(error){
                            /** get cek konsul error */
                            res.status(500).json({
                                message: "Cek data konsultasi error",
                            });
                        } else if(cekkonsul.length == 0){
                            /** data konsul tidak ada */
                            res.status(403).json({
                                message: "Tipe konsultasi tidak terdaftar",
                            });
                        } else if(cekkonsul.length > 0){
                            /** cek peserta */
                            Connection.query("SELECT id FROM icare_account WHERE id = ? AND (account_type = 'peserta' OR account_type = 'peserta_event')", [selectpeserta], async (error, cekpeserta) => {
                                if(error){
                                    /** get cek peserta error */
                                    res.status(500).json({
                                        message: "Cek data peserta error",
                                    });
                                } else if(cekpeserta.length == 0){
                                    /** data peserta tidak ada */
                                    res.status(403).json({
                                        message: "Peserta tidak terdaftar",
                                    });                            
                                } else if(cekpeserta.length > 0){
                                    /** cek psikolog */
                                    Connection.query("SELECT id FROM icare_account WHERE id = ? AND ((account_type = 'psikologis' OR account_type = 'konsultan')OR account_type = 'admin')", [idpsikolog], async (error, cekpsikolog) => {
                                        if(error){
                                            /** get cek psikolog error */
                                            res.status(500).json({
                                                message: "Cek data psikolog error",
                                            });
                                        } else if(cekpsikolog.length == 0){             
                                            /** data psikolog tidak ada */
                                            res.status(403).json({
                                                message: "Psikolog tidak terdaftar",
                                            }); 
                                        } else if(cekpsikolog.length > 0){
                                            /** update data kesimpulan */
                                            Connection.query("UPDATE icare_conc SET ? WHERE id = ?",[{conc: kesimpulan, verified_by: idpsikolog, date_updated: tanggal, time_updated: waktu}, idkesimpulan], async (error, results) => {
                                                if(error) {
                                                    /** edit kesimpulan error */
                                                    res.status(500).json({
                                                        message: "Edit kesimpulan error",
                                                    });
                                                } else {
                                                    /** edit kesimpulan berhasil */
                                                    res.status(200).json({
                                                        message: "Kesimpulan berhasil diubah",
                                                        selectkonsul, selectpeserta
                                                    });                                       
                                                }
                                            })
                                        } else {
                                            /** get cek psikolog error */
                                            res.status(403).json({
                                                message: "Cek data psikolog error",
                                            });
                                        }
                                    })
                                } else {
                                    /** get cek peserta error */
                                    res.status(403).json({
                                        message: "Cek data peserta error",
                                    });
                                }
                            })
                        } else {
                            /** get cek konsul error */
                            res.status(403).json({
                                message: "Cek data konsultasi error",
                            });
                        }
                    })
                } else {
                    /** get cek kesimpulan error */
                    res.status(500).json({
                        message: "Cek data kesimpulan error",
                    });
                }
            })
        } else {
            /** try error */
            res.status(403).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch(error) {
        /** try error */
        res.status(500).json({
            message: "Try get data error",
        });
    }
}

exports.deleteKesimpulan = (req, res) => {
    try{
        const { idkesimpulan, selectkonsul, selectpeserta, idpsikolog } = req.body
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(idkesimpulan && selectkonsul && selectpeserta && idpsikolog){
            Connection.query("SELECT * FROM icare_conc WHERE id = ? AND id_consult_type = ? AND id_account = ?", [idkesimpulan, selectkonsul, selectpeserta], async (error, cekkesimpulan) => {
                if(error) {
                    /** get cek kesimpulan error */
                    res.status(500).json({
                        message: "Cek data kesimpulan error",
                    });
                } else if(cekkesimpulan.length == 0){
                    /** kesimpulan tidak terdaftar */
                    res.status(403).json({
                        message: "Kesimpulan tidak terdaftar",
                    });
                } else if(cekkesimpulan.length > 0){
                    /** cek konsul */
                    Connection.query("SELECT id FROM icare_consult_type WHERE id = ? AND NOT status_consult = 'hapus'", [selectkonsul], async (error, cekkonsul) => {
                        if(error){
                            /** get cek konsul error */
                            res.status(500).json({
                                message: "Cek data konsultasi error",
                            });
                        } else if(cekkonsul.length == 0){
                            /** data konsul tidak ada */
                            res.status(403).json({
                                message: "Tipe konsultasi tidak terdaftar",
                            });
                        } else if(cekkonsul.length > 0){
                            /** cek peserta */
                            Connection.query("SELECT id FROM icare_account WHERE id = ? AND (account_type = 'peserta' OR account_type = 'peserta_event')", [selectpeserta], async (error, cekpeserta) => {
                                if(error){
                                    /** get cek peserta error */
                                    res.status(500).json({
                                        message: "Cek data peserta error",
                                    });
                                } else if(cekpeserta.length == 0){
                                    /** data peserta tidak ada */
                                    res.status(403).json({
                                        message: "Peserta tidak terdaftar",
                                    });                            
                                } else if(cekpeserta.length > 0){
                                    /** cek psikolog */
                                    Connection.query("SELECT id FROM icare_account WHERE id = ? AND ((account_type = 'psikologis' OR account_type = 'konsultan')OR account_type = 'admin')", [idpsikolog], async (error, cekpsikolog) => {
                                        if(error){
                                            /** get cek psikolog error */
                                            res.status(500).json({
                                                message: "Cek data psikolog error",
                                            });
                                        } else if(cekpsikolog.length == 0){             
                                            /** data psikolog tidak ada */
                                            res.status(403).json({
                                                message: "Psikolog tidak terdaftar",
                                            }); 
                                        } else if(cekpsikolog.length > 0){
                                            /** hapus data kesimpulan */
                                            Connection.query("UPDATE icare_conc SET ? WHERE id = ?",[{status: 'hapus', verified_by: idpsikolog, date_updated: tanggal, time_updated: waktu}, idkesimpulan], async (error, results) => {
                                                if(error) {
                                                    /** hapus kesimpulan error */
                                                    res.status(500).json({
                                                        message: "Hapus kesimpulan error",
                                                    });
                                                } else {
                                                    /** edit kesimpulan berhasil */
                                                    res.status(200).json({
                                                        message: "Kesimpulan berhasil dihapus",
                                                        selectkonsul
                                                    });                          
                                                }
                                            })
                                        } else {
                                            /** get cek psikolog error */
                                            res.status(403).json({
                                                message: "Cek data psikolog error",
                                            });
                                        }
                                    })
                                } else {
                                    /** get cek peserta error */
                                    res.status(403).json({
                                        message: "Cek data peserta error",
                                    });
                                }
                            })
                        } else {
                            /** get cek konsul error */
                            res.status(403).json({
                                message: "Cek data konsultasi error",
                            });
                        }
                    })
                } else {
                    /** get cek kesimpulan error */
                    res.status(500).json({
                        message: "Cek data kesimpulan error",
                    });
                }
            })
        } else {
            /** try error */
            res.status(403).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch(error) {
        /** try error */
        res.status(500).json({
            message: "Try get data error",
        });
    }
}