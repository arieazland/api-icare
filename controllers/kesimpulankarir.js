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
                    /** cekkesimpulan */
                    const cekkesimpulan = await new Promise((resolve, reject) => {
                        Connection.query("SELECT * FROM icare_conc WHERE id_consult_type = 1 AND id_account = ? AND NOT status = 'hapus' ", [selectpeserta], (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(cekkesimpulan.length === 0){
                        /** get nama url room daily.co psikolog terkait */
                        const nama_room = await new Promise((resolve, reject) => {
                            Connection.query("SELECT * FROM icare_roomvidcall WHERE idpsikolog = ? AND status = 'aktif'", [idpsikolog], async (error, results) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve(results)
                                }
                            })
                        })
                        if(nama_room.length === 1){
                            /** input data kesimpulan */
                            const insertkesimpulan = await new Promise((resolve, reject) => {
                                Connection.query("INSERT INTO icare_conc SET ?", {id: null, id_consult_type: '1', id_account: selectpeserta, conc: kesimpulan, verified_by: idpsikolog, status: 'aktif', date_created: tanggal, time_created: waktu }, async (error, results) => {
                                    if(error){
                                        reject(error)
                                    } else {
                                        resolve("true")
                                    }
                                })
                            })
                            if(insertkesimpulan === "true"){
                                /** insert kesimpulan berhasil */
                                res.status(200).json({
                                    message: "Kesimpulan Berhasil Disimpan",
                                    nama_room
                                });
                            } else {
                                /** send error */
                                throw new Error('Kesimpulan Gagaln Disimpan');
                            }
                        } else if(nama_room.length === 0){
                            /** send error */
                            throw new Error('Psikolog tidak memiliki room video call, harap hubungi admin');
                        } else if(nama_room.length > 1) {
                            /** send error */
                            throw new Error('Psikolog memiliki room video call lebih dari 1, harap hubungi admin');
                        } else {
                            /** send error */
                            throw new Error('Get data room video call gagal, harap hubungi admin');
                        }
                    } else if(cekkesimpulan.length > 0){
                        /** send error */
                        throw new Error('Kesimpulan Sudah Ada');
                    } else {
                        /** send error */
                        throw new Error('Cek Kesimpulan Error');
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

exports.editKesimpulan = async (req, res) => {
    const { idkesimpulan, selectpeserta, idpsikolog, kesimpulan, selectsesi } = req.body
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss")

    if(idkesimpulan && selectpeserta && idpsikolog && kesimpulan && selectsesi){
        try{
            /** cekkesimpulan */
            const cekkesimpulan = await new Promise((resolve, reject) => {
                Connection.query("SELECT * FROM icare_conc WHERE id = ? AND id_consult_type = 1 AND id_account = ?", [idkesimpulan, selectpeserta], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cekkesimpulan.length > 0){
                /** cekkesimpulan */
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
                        /** udpate kesimpulan karir */
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
                            /** edit kesimpulan berhasil */
                            res.status(200).json({
                                message: "Kesimpulan Berhasil Diubah",
                                selectpeserta, selectsesi
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

exports.deleteKesimpulan = async (req, res) => {
    const { idkesimpulan, selectpeserta, idpsikolog, selectsesi } = req.body
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss")

    if(idkesimpulan && selectpeserta && idpsikolog && selectsesi){
        try{
            /** cekkesimpulan */
            const cekkesimpulan = await new Promise((resolve, reject) => {
                Connection.query("SELECT * FROM icare_conc WHERE id = ? AND id_consult_type = 1 AND id_account = ?", [idkesimpulan, selectpeserta], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cekkesimpulan.length > 0) {
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
                        /** hapus kesimpulan */
                        const hapuskesimpulan = await new Promise((resolve, reject) => {
                            Connection.query("UPDATE icare_conc SET ? WHERE id = ?",[{status: 'hapus', verified_by: idpsikolog, date_updated: tanggal, time_updated: waktu}, idkesimpulan], async (error) => {
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
                                message: "Kesimpulan Berhasil Dihapus",
                                selectsesi
                            });
                        } else {
                            /** send error */
                            throw new Error('Kesimpulan Gagal Dihapus');
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