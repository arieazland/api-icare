const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcryptjs');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

exports.registerJawabsatu = async (req, res) => {
    const { iduser, idpart, idsoal, radio1, radio2, radio3, radio4, essayboxg, essayboxi } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");

    if(iduser && idpart && idsoal && radio1 && radio2 && radio3 && radio4){
        try{
            /** cek user */
            const cek_user = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM icare_account WHERE id = ?", [iduser], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_user.length > 0){
                /** user terdaftar */
                /** cek part */
                const cek_part = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id FROM icare_passessment WHERE id = ?", [idpart], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(cek_part.length > 0){
                    /** part terdaftart */
                    /** cek soal */
                    const cek_soal = await new Promise((resolve, reject) => {
                        Connection.query("SELECT id FROM icare_q3assessment WHERE id IN (?)", [idsoal], (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(cek_soal.length > 0) {
                        /** soal terdaftar */
                        /** input jawaban1 */
                        const input_jawaban1 = await new Promise((resolve, reject) => {
                            Connection.query("INSERT INTO icare_a2assessment SET ?", {id: null, id_consult_type: '1', idpart: idpart, id_pertanyaan: idsoal[0], id_account: iduser, jawaban: radio1, jawaban_essay: essayboxg, sub_jawaban: null, status: 'aktif', date_created: tanggal, date_updated: null, time_created: waktu, time_updated: null}, (error) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })

                        const input_jawaban2 = await new Promise((resolve, reject) => {
                            Connection.query("INSERT INTO icare_a2assessment SET ?", {id: null, id_consult_type: '1', idpart: idpart, id_pertanyaan: idsoal[1], id_account: iduser, jawaban: radio2, jawaban_essay: null, sub_jawaban: null, status: 'aktif', date_created: tanggal, date_updated: null, time_created: waktu, time_updated: null}, (error) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })

                        const input_jawaban3 = await new Promise((resolve, reject) => {
                            Connection.query("INSERT INTO icare_a2assessment SET ?", {id: null, id_consult_type: '1', idpart: idpart, id_pertanyaan: idsoal[2], id_account: iduser, jawaban: radio3, jawaban_essay: null, sub_jawaban: null, status: 'aktif', date_created: tanggal, date_updated: null, time_created: waktu, time_updated: null}, (error) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })

                        const input_jawaban4 = await new Promise((resolve, reject) => {
                            Connection.query("INSERT INTO icare_a2assessment SET ?", {id: null, id_consult_type: '1', idpart: idpart, id_pertanyaan: idsoal[3], id_account: iduser, jawaban: radio4, jawaban_essay: essayboxi, sub_jawaban: null, status: 'aktif', date_created: tanggal, date_updated: null, time_created: waktu, time_updated: null}, (error) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })
                        
                        if(input_jawaban1 === "true" && input_jawaban2 === "true" && input_jawaban3 === "true" && input_jawaban4 === "true"){
                            /** berhasil simpan jawaban */
                            res.status(201).json({
                                message: "Jawaban berhasil disimpan, terima kasih atas partisipasinya",
                            });
                        } else {
                            /** gagal simpan jawaban 1 */
                            throw new Error('Simpan jawaban gagal');
                        }

                    } else {
                        /** soal tidak terdaftar */
                        throw new Error('Soal Tidak Terdaftar');
                    }

                } else {
                    /** part tidak terdaftar */
                    throw new Error('Part Tidak Terdaftar');
                }

            } else {
                /** user tidak terdaftar */
                throw new Error('User Tidak Terdaftar');
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

exports.registerJawabdua = async (req, res) => {
    const { iduser, idpart, idsoal, radio5, radio6, radio7, radio8, radiosub5 , essayboxi } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");

    if(iduser && idpart && idsoal && radio5 && radio6 && radio7 && radio8){
        try{
            /** cek user */
            const cek_user = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM icare_account WHERE id = ?", [iduser], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_user.length > 0){
                /** user terdaftar */
                /** cek part */
                const cek_part = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id FROM icare_passessment WHERE id = ?", [idpart], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(cek_part.length > 0){
                    /** part terdaftart */
                    /** cek soal */
                    const cek_soal = await new Promise((resolve, reject) => {
                        Connection.query("SELECT id FROM icare_q3assessment WHERE id IN (?)", [idsoal], (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(cek_soal.length > 0) {
                        /** soal terdaftar */
                        /** input jawaban1 */
                        const input_jawaban1 = await new Promise((resolve, reject) => {
                            Connection.query("INSERT INTO icare_a2assessment SET ?", {id: null, id_consult_type: '1', idpart: idpart, id_pertanyaan: idsoal[0], id_account: iduser, jawaban: radio5, jawaban_essay: null, sub_jawaban: radiosub5, status: 'aktif', date_created: tanggal, date_updated: null, time_created: waktu, time_updated: null}, (error) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })

                        const input_jawaban2 = await new Promise((resolve, reject) => {
                            Connection.query("INSERT INTO icare_a2assessment SET ?", {id: null, id_consult_type: '1', idpart: idpart, id_pertanyaan: idsoal[1], id_account: iduser, jawaban: radio6, jawaban_essay: null, sub_jawaban: null, status: 'aktif', date_created: tanggal, date_updated: null, time_created: waktu, time_updated: null}, (error) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })

                        const input_jawaban3 = await new Promise((resolve, reject) => {
                            Connection.query("INSERT INTO icare_a2assessment SET ?", {id: null, id_consult_type: '1', idpart: idpart, id_pertanyaan: idsoal[2], id_account: iduser, jawaban: radio7, jawaban_essay: null, sub_jawaban: null, status: 'aktif', date_created: tanggal, date_updated: null, time_created: waktu, time_updated: null}, (error) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })

                        const input_jawaban4 = await new Promise((resolve, reject) => {
                            Connection.query("INSERT INTO icare_a2assessment SET ?", {id: null, id_consult_type: '1', idpart: idpart, id_pertanyaan: idsoal[3], id_account: iduser, jawaban: radio8, jawaban_essay: essayboxi, sub_jawaban: null, status: 'aktif', date_created: tanggal, date_updated: null, time_created: waktu, time_updated: null}, (error) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })
                        
                        if(input_jawaban1 === "true" && input_jawaban2 === "true" && input_jawaban3 === "true" && input_jawaban4 === "true"){
                            /** berhasil simpan jawaban */
                            res.status(201).json({
                                message: "Jawaban berhasil disimpan, terima kasih atas partisipasinya",
                            });
                        } else {
                            /** gagal simpan jawaban 1 */
                            throw new Error('Simpan jawaban gagal');
                        }

                    } else {
                        /** soal tidak terdaftar */
                        throw new Error('Soal Tidak Terdaftar');
                    }

                } else {
                    /** part tidak terdaftar */
                    throw new Error('Part Tidak Terdaftar');
                }

            } else {
                /** user tidak terdaftar */
                throw new Error('User Tidak Terdaftar');
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

exports.registerJawabtiga = async (req, res) => {
    const { iduser, idpart, idsoal, radio9, radio10, essayboxi } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");

    if(iduser && idpart && idsoal && radio9 && radio10){
        try{
            /** cek user */
            const cek_user = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM icare_account WHERE id = ?", [iduser], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_user.length > 0){
                /** user terdaftar */
                /** cek part */
                const cek_part = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id FROM icare_passessment WHERE id = ?", [idpart], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(cek_part.length > 0){
                    /** part terdaftart */
                    /** cek soal */
                    const cek_soal = await new Promise((resolve, reject) => {
                        Connection.query("SELECT id FROM icare_q3assessment WHERE id IN (?)", [idsoal], (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(cek_soal.length > 0) {
                        /** soal terdaftar */
                        /** input jawaban1 */
                        const input_jawaban1 = await new Promise((resolve, reject) => {
                            Connection.query("INSERT INTO icare_a2assessment SET ?", {id: null, id_consult_type: '1', idpart: idpart, id_pertanyaan: idsoal[0], id_account: iduser, jawaban: radio9, jawaban_essay: null, sub_jawaban: null, status: 'aktif', date_created: tanggal, date_updated: null, time_created: waktu, time_updated: null}, (error) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })

                        const input_jawaban2 = await new Promise((resolve, reject) => {
                            Connection.query("INSERT INTO icare_a2assessment SET ?", {id: null, id_consult_type: '1', idpart: idpart, id_pertanyaan: idsoal[1], id_account: iduser, jawaban: radio10, jawaban_essay: essayboxi, sub_jawaban: null, status: 'aktif', date_created: tanggal, date_updated: null, time_created: waktu, time_updated: null}, (error) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve("true")
                                }
                            })
                        })
                        
                        if(input_jawaban1 === "true" && input_jawaban2 === "true"){
                            /** berhasil simpan jawaban */
                            res.status(201).json({
                                message: "Jawaban Berhasil Disimpan, Silahkan Cek Terus Email Anda, Link Video Call akan Dikirimkan ke Email Anda, Terima Kasih Atas Partisipasinya",
                            });
                        } else {
                            /** gagal simpan jawaban 1 */
                            throw new Error('Simpan Jawaban Gagal');
                        }

                    } else {
                        /** soal tidak terdaftar */
                        throw new Error('Soal Tidak Terdaftar');
                    }

                } else {
                    /** part tidak terdaftar */
                    throw new Error('Part Tidak Terdaftar');
                }

            } else {
                /** user tidak terdaftar */
                throw new Error('User Tidak Terdaftar');
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

exports.registerJawab = (req, res) => {
    // try{
    //     const { jawaban, idpertanyaan, iduser, idkonsul } = req.body;
    //     var tanggal = Moment().format("YYYY-MM-DD");
    //     var waktu = Moment().format("HH:mm:ss")

    //     if( jawaban && idpertanyaan && iduser && idkonsul){
    //         var sql = "INSERT INTO icare_aassessment (id, id_account, id_pertanyaan, jawaban, date_created, time_created) VALUES ?";
    //         var value = [];
    //         for( var i = 0; i < jawaban.length; i++){
    //             value.push([null, iduser, idpertanyaan[i], jawaban[i], tanggal, waktu]);
    //         }
    //         Connection.query(sql, [value], async (error, results) => {
    //             if(error){
    //                 console.log(error) 
    //             } else {
    //                 /** Input jawaban berhasil */
    //                 res.status(201).json({
    //                     message: "Jawaban berhasil di simpan",
    //                     idkonsul
    //                 });
    //             }
    //         })
    //     } else {
    //         /** Field kosong */
    //         res.status(500).json({
    //             message: "Field tidak boleh kosong"
    //         });
    //     }
    // } catch (error){
    //     console.log(error)
    // }
};

exports.editJawab = (req, res) => {
    
};

exports.deleteJawab = (req, res) => {
    
};