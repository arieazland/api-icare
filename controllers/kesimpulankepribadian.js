const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcryptjs');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
const { CONNREFUSED } = require("dns");
const { resume } = require("../DBconnection");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

exports.registerKesimpulan = async (req, res) => {
    
        const { selectpeserta, idpsikolog, kesimpulan } = req.body
        var tanggal = Moment().format("YYYY-MM-DD");
        var waktu = Moment().format("HH:mm:ss")

        if(selectpeserta && idpsikolog && kesimpulan){
            try{
                const cek_peserta = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id FROM cdc_account WHERE id = ? AND (account_type = 'peserta' OR account_type = 'peserta_event')", [selectpeserta], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(cek_peserta.length > 0){
                    /** cek psikolog*/
                    const cek_psikolog = await new Promise((resolve, reject) => {
                        Connection.query("SELECT id FROM cdc_account WHERE id = ? AND ((account_type = 'psikologis' OR account_type = 'konsultan')OR account_type = 'admin')", [idpsikolog], (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(cek_psikolog.length > 0){
                        /** cek kesimpulan sudah ada atau belum */
                        const cek_kesimpulan = await new Promise((resolve, reject) => {
                            Connection.query("SELECT * FROM icare_conc WHERE id_consult_type = 3 AND id_account = ? AND NOT status = 'hapus'", [selectpeserta], (error, results) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve(results)
                                }
                            })
                        })
                        if(cek_kesimpulan.length === 0){
                            /** input kesimpulan kepribadian */
                            const insert_kesimpulan = await new Promise((resolve, reject) => {
                                Connection.query("INSERT INTO icare_conc SET ?", {id: null, id_consult_type: '3', id_account: selectpeserta, conc: kesimpulan, verified_by: idpsikolog, status: 'aktif', date_created: tanggal, time_created: waktu }, async (error, results) => {
                                    if(error){
                                        reject(error)
                                    } else {
                                        resolve("true")
                                    }
                                })
                            })
                            if(insert_kesimpulan === "true"){
                                /** berhasil simpan kesimpulan */
                                res.status(201).json({
                                    message: "Kesimpulan Berhasil Disimpan",
                                });
                            } else {
                                /** send error */
                                throw new Error('Kesimpulan Gagal Ditambahkan');
                            }
                        } else if(cek_kesimpulan.length > 0){
                            /** send error kesimpulan sudah di isi */
                            throw new Error('Kesimpulan Sudah diisi');    
                        } else {
                            /** send error */
                            throw new Error('Cek Kesimpulan Error');    
                        }
                    } else if(cek_psikolog.length === 0) {
                        /** send error Psikolog tidak terdaftar */
                        throw new Error('Psikolog Tidak Terdaftar');
                    } else {
                        /** send error */
                        throw new Error('Cek Psikolog Error');
                    }
                } else if(cek_peserta.length === 0){
                    /** send error Peserta tidak terdaftar */
                    throw new Error('Peserta Tidak Terdaftar');
                } else {
                    /** send error */
                    throw new Error('Cek Peserta Error');
                }
            } catch(e) {
                /** send error */
                res.status(400).json({ message: e.message });
            }
        } else {
            /** try error */
            res.status(403).json({
                message: "Field tidak boleh kosong"
            });
        }
}

exports.editKesimpulan = async (req, res) => {
    const { idkesimpulan, selectpeserta, idpsikolog, kesimpulan } = req.body
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss")

    if(idkesimpulan && selectpeserta && idpsikolog && kesimpulan){

        try{
            /** cekkesimpulan */
            const cekkesimpulan = await new Promise((resolve, reject) => {
                Connection.query("SELECT * FROM icare_conc WHERE id = ? AND id_consult_type = 3 AND id_account = ?", [idkesimpulan, selectpeserta], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cekkesimpulan.length > 0){
                /** cekpeserta */
                const cekpeserta = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id FROM cdc_account WHERE id = ? AND (account_type = 'peserta' OR account_type = 'peserta_event')", [selectpeserta], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(cekpeserta.length > 0){
                    /** cekpsikolog */
                    const cekpsikolog = await new Promise((resolve, reject) => {
                        Connection.query("SELECT id FROM cdc_account WHERE id = ? AND ((account_type = 'psikologis' OR account_type = 'konsultan')OR account_type = 'admin')", [idpsikolog], (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(cekpsikolog.length > 0){
                        /** update data kesimpulan */
                        const updatekesimpulan = await new Promise((resolve, reject) => {
                            Connection.query("UPDATE icare_conc SET ? WHERE id = ?",[{conc: kesimpulan, verified_by: idpsikolog, date_updated: tanggal, time_updated: waktu}, idkesimpulan], (error, results) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })
                        if(updatekesimpulan === "true"){
                            /** kesimpulan berhasil diubah */
                            res.status(200).json({
                                message: "Kesimpulan berhasil diubah",
                                selectpeserta
                            }); 
                        } else {
                            /** send error */
                            throw new Error('Kesimpulan Gagal Diubah');
                        }
                    } else if(cekpsikolog.length === 0){
                        /** send error */
                        throw new Error('Psikolog Tidak Terdaftar');    
                    } else {
                        /** send error */
                        throw new Error('Get data psikolog error');    
                    }
                } else if(cekpeserta.length === 0){
                    /** send error */
                    throw new Error('Peserta Tidak Terdaftar');    
                } else {
                    /** send error */
                    throw new Error('Get data peserta error');
                }
            } else if(cekkesimpulan.length === 0) {
                /** send error */
                throw new Error('Kesimpulan Tidak Terdaftar');
            } else {
                /** send error */
                throw new Error('Cek Kesimpulan Error');
            }
        } catch(e){
            /** send error */
            res.status(400).json({ message: e.message });
        }                          
    } else {
        /** try error */
        res.status(403).json({
            message: "Field tidak boleh kosong"
        });
    }
}

exports.deleteKesimpulan = async (req, res) => {
    const { idkesimpulan, selectpeserta, idpsikolog } = req.body
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss")

    if(idkesimpulan && selectpeserta && idpsikolog){
        try{
            /** cekkesimpulan */
            const cekkesimpulan = await new Promise((resolve, reject) => {
                Connection.query("SELECT * FROM icare_conc WHERE id = ? AND id_consult_type = 3 AND id_account = ?", [idkesimpulan, selectpeserta], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cekkesimpulan.length > 0){
                /** cekpeserta */
                const cekpeserta = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id FROM cdc_account WHERE id = ? AND (account_type = 'peserta' OR account_type = 'peserta_event')", [selectpeserta], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(cekpeserta.length > 0){
                    /** cekpsikolog */
                    const cekpsikolog = await new Promise((resolve, reject) => {
                        Connection.query("SELECT id FROM cdc_account WHERE id = ? AND ((account_type = 'psikologis' OR account_type = 'konsultan')OR account_type = 'admin')", [idpsikolog], (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(cekpsikolog.length > 0){
                        /** hapus data kesimpulan */
                        const hapuskesimpulan = await new Promise((resolve, reject) => {
                            Connection.query("UPDATE icare_conc SET ? WHERE id = ?",[{status: 'hapus', verified_by: idpsikolog, date_updated: tanggal, time_updated: waktu}, idkesimpulan], async (error, results) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })
                        if(hapuskesimpulan === "true"){
                            /** hapus kesimpulan berhasil */
                            res.status(200).json({
                                message: "Kesimpulan berhasil dihapus",
                            });  
                        } else {
                            /** send error */
                            throw new Error('Hapus Kesimpulan Gagal');    
                        }
                    } else if(cekpsikolog.length === 0){
                        /** send error */
                        throw new Error('Psikolog Tidak Terdaftar');
                    } else {
                        /** send error */
                        throw new Error('Cek Psikolog Error');
                    }
                } else if(cekpeserta.length === 0){
                    /** send error */
                    throw new Error('Peserta Tidak Terdaftar');
                } else {
                    /** send error */
                    throw new Error('Cek Peserta Error');
                }
            } else if(cekkesimpulan.length === 0){
                /** send error */
                throw new Error('Kesimpulan Tidak Terdaftar');
            } else {
                /** send error */
                throw new Error('Cek Kesimpulan Error');
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** try error */
        res.status(403).json({
            message: "Field tidak boleh kosong"
        });
    }
}