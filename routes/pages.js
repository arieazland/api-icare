const Express = require("express");
const app = Express();
const Router = Express.Router();
const Dotenv = require("dotenv");
// Set Moment Format engine
const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");
//const { Cookie } = require("express-session");

/** Route for Register */
Router.get('/', (req, res) => {
    res.send("Hello, welcome to API-ICare Page")
})

Router.get('/userlist', (req, res) =>{
    Connection.query("SELECT * FROM cdc_account WHERE NOT account_type = 'nonaktif' ORDER BY nama ASC", async (error, results) =>{
        if(error){ 
            res.status(500).json({
                message: 'Get data users error'
            })
        } else if(results.length >= 0){
            /** Kirim data user */
            res.status(201).json({
                data: results
            })
        }
    })
})

/** Route for cek ketersediaan room psikolog */
Router.post("/cekroom", async (req, res) => {
    const {psikolog} = req.body;
    if(psikolog){
        try{
            /** cek room by id psikolog */
            const cek_room = await new Promise((resolve, reject) => {
                Connection.query(" SELECT * FROM icare_roomvidcall WHERE idpsikolog = ? AND status = 'aktif' ", [psikolog],(error, results) => {
                    if(error) { 
                        /** jika error */
                        reject(error);
                    } else {
                        /** jika results */
                        resolve(results);
                    }
                });
            });

            if(cek_room.length === 0){
                /** Kirim data */
                const jumlahUrl = 0;
                res.status(200).json({
                    psikolog, jumlahUrl
                })
            } else if(cek_room.length === 1) {
                /** kirim data URL lebih dari 1 */
                const jumlahUrl = 1;
                res.status(200).json({
                    psikolog, jumlahUrl, cek_room
                })
            } else {
                /** send error */
                throw new Error("Pengecekkan room psikolog gagal")
            }
        } catch(e) {
            res.status(400).json({ message: e.message }); 
        }
    } else {
        /** field kosong */
        res.status(403).json({
            message: "Field tidak boleh kosong"
        })
    }
})

Router.post("/getpesertavidcall", async (req, res) => {
    const { idpeserta, idpsikolog  } = req.body;

    if(idpeserta && idpsikolog ){
        try{
            /** cek data peserta */
            const cek_peserta = await new Promise((resolve, reject) => {
                Connection.query(" SELECT id, email FROM cdc_account WHERE id = ? AND account_type IN ('peserta','peserta_event') ", [idpeserta],(error, results) => {
                    if(error) { 
                        /** jika error */
                        reject(error);
                    } else {
                        /** jika results */
                        resolve(results);
                    }
                });
            });
            if(cek_peserta.length > 0){
                /** cek data psikolog */
                const cek_psikolog = await new Promise((resolve, reject) => {
                    Connection.query("SELECT * FROM cdc_account WHERE id = ? AND account_type IN ('konsultan','psikologis') ", [idpsikolog],(error, results) => {
                        if(error) { 
                            /** jika error */
                            reject(error);
                        } else {
                            /** jika results */
                            resolve(results);
                        }
                    });
                });
                if(cek_psikolog.length > 0){
                    /** get url video call room */
                    const urlroom = await new Promise((resolve, reject) => {
                        Connection.query("SELECT url_room FROM icare_roomvidcall WHERE idpsikolog = ? AND status = 'aktif' ", [idpsikolog],(error, results) => {
                            if(error) { 
                                /** jika error */
                                reject(error);
                            } else {
                                /** jika results */
                                resolve(results);
                            }
                        });
                    });

                    const real_urlroom = await new Promise((resolve, reject) => {
                        Connection.query("SELECT real_url_room FROM icare_roomvidcall WHERE idpsikolog = ? AND status = 'aktif' ", [idpsikolog],(error, results) => {
                            if(error) { 
                                /** jika error */
                                reject(error);
                            } else {
                                /** jika results */
                                resolve(results);
                            }
                        });
                    });

                    if(urlroom.length > 0 && real_urlroom.length > 0){
                        /** Kirim data */
                        res.status(200).json({
                            urlroom, cek_peserta, real_urlroom
                        })
                    } else if(urlroom == 0 && real_urlroom == 0){
                        /** send error */
                        throw new Error('Psikolog Belum Mendapatkan URL Room Video Call, Silahkan kontak admin');
                    } else{
                        /** send error */
                        throw new Error('Get data url room gagal');
                    }

                } else if(cek_psikolog.length === 0){
                    /** send error */
                    throw new Error('Psikolog tidak terdaftar');
                } else {
                    /** send error */
                    throw new Error('Get data psikolog gagal');
                }

            } else if(cek_peserta.length === 0){
                /** send error */
                throw new Error('Peserta tidak terdaftar');
            } else {
                /** send error */
                throw new Error('Get data peserta gagal');
            }

        } catch (e) {
            res.status(400).json({ message: e.message });   
        }
    } else {
        /** field kosong */
        res.status(403).json({
            message: "Field tidak boleh kosong"
        })
    }
})

// Router.post("/getpeserta", (req, res) => {
//     try{

//         const { idpeserta } = req.body

//         if(idpeserta){
//             Connection.query("SELECT id, email, nama, phone FROM cdc_account WHERE id = ? AND account_type IN ('peserta','peserta_event')", [idpeserta], async (error, cekpeserta) => {
//                 if(error) {
//                     /** Kirim error */
//                     res.status(500).json({
//                         message: error
//                     })
//                 } else if(cekpeserta.length == 0) {
//                     /** data peserta tidak ada */
//                     res.status(403).json({
//                         message: "Peserta tidak terdaftar"
//                     })
//                 } else if(cekpeserta.length > 0) {
//                     /** get data peserta */
//                     res.status(200).json({
//                         data: cekpeserta
//                     })
//                 } else {
//                     /** Kirim error */
//                     res.status(500).json({
//                         message: "Error, please contact developer"
//                     })
//                 }
//             })
//         } else {
//             /** field kosong */
//             res.status(403).json({
//                 message: "Field tidak boleh kosong"
//             })
//         }
//     } catch (error) {
//         /** Kirim error */
//         res.status(500).json({
//             message: error
//         })
//     }
// })

// Router.get('/konsullist', (req, res) => {
//     Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, results) => {
//         if(error){
//             res.status(500).json({
//                 message: 'Get data konsul error'
//             })
//         } else if(results.length >= 0){
//             /** Kirim data konsul */
//             res.status(200).json({
//                 data: results
//             })
//         }
//     })
// })

// Router.post('/konsulid', (req, res) => {
//     try{
//         // var id = req.params.id;
//         const { id } = req.body;
//         if(id){
//             Connection.query('SELECT * FROM icare_consult_type WHERE id = ?', [id], async (error, results) => {
//                 if(error){
//                     res.status(500).json({
//                         message: 'Get data konsul error'
//                     })
//                 } else if(results.length >= 0 ){
//                     /** Kirim data konsul */
//                     res.status(200).json({
//                         data: results
//                     })
//                 }
//             })
//         } else {
//             /** Field kosong */
//             res.status(500).json({
//                 message: "Field tidak boleh kosong"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// })

// Router.post('/partisipant', (req, res) => {
//     try{
//         // var id = req.params.id;
//         const { selectkonsul } = req.body;
//         if(selectkonsul){
//             Connection.query('SELECT a.id AS idca, u.id AS iduser, u.nama AS namauser FROM icare_consult_acc a INNER JOIN icare_consult_type t ON a.id_tipe_konsultasi = t.id INNER JOIN cdc_account u ON a.id_account = u.id WHERE t.id = ?', [selectkonsul], async (error, results) => {
//                 if(error){
//                     res.status(500).json({
//                         message: 'Get data partisipant error'
//                     })
//                 } else if(results.length >= 0 ){
//                     Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
//                         if(error){
//                             res.status(500).json({
//                                 message: error
//                             })
//                         } else {
//                             Connection.query('SELECT id, nama FROM icare_consult_type WHERE id = ?', [selectkonsul], async (error, pilihkonsul) => {
//                                 if(error){
//                                     res.status(500).json({
//                                         message: error
//                                     })
//                                 } else {
//                                     Connection.query('SELECT u.id, u.nama FROM cdc_account u WHERE account_type = ? AND u.id NOT IN (SELECT a.id_account FROM icare_consult_acc a WHERE a.id_tipe_konsultasi = ?)', ['psikologis', selectkonsul], async (error, psikolog) => {
//                                         if(error){
//                                             res.status(500).json({
//                                                 message: error
//                                             })
//                                         } else {
//                                             /** Kirim data konsul */
//                                             res.status(200).json({
//                                                 results: results,
//                                                 konsul : konsul,
//                                                 pilihkonsul: pilihkonsul,
//                                                 psikolog : psikolog,
//                                                 selectkonsul
//                                             })
//                                         }
//                                     } )
//                                 }
//                             })
//                         }
//                     })
//                 }
//             })
//         } else {
//             /** Field kosong */
//             res.status(500).json({
//                 message: "Field tidak boleh kosong"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// })

// Router.post('/listsoal', (req, res) => {
//     try{
//         // var id = req.params.id;
//         const { selectkonsul } = req.body;
//         if(selectkonsul){
//             Connection.query('SELECT q.id AS idp, q.pertanyaan AS pertanyaan FROM icare_qassessment q INNER JOIN icare_consult_type t ON t.id = q.id_consult_type WHERE t.id = ? AND NOT q.status = "hapus" ', [selectkonsul], async (error, results) => {
//                 if(error){
//                     res.status(500).json({
//                         message: 'Get data partisipant error'
//                     })
//                 } else if(results.length >= 0 ){
//                     Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
//                         if(error){
//                             res.status(500).json({
//                                 message: error
//                             })
//                         } else {
//                             Connection.query('SELECT id, nama FROM icare_consult_type WHERE id = ?', [selectkonsul], async (error, pilihkonsul) => {
//                                 if(error){
//                                     res.status(500).json({
//                                         message: error
//                                     })
//                                 } else {
//                                     /** Kirim data konsul */
//                                     res.status(200).json({
//                                         results: results,
//                                         konsul : konsul,
//                                         pilihkonsul: pilihkonsul,
//                                         selectkonsul
//                                     })
//                                 }
//                             })
//                         }
//                     })
//                 }
//             })
//         } else {
//             /** Field kosong */
//             res.status(500).json({
//                 message: "Field tidak boleh kosong"
//             });
//         }
//     } catch (error) {
//         console.log(error);
//     }
// })

Router.post('/listpartkarir', async (req, res) => {
    const { selectuser } = req.body;
    if(selectuser){
        try{
            /** cek kuota peserta sesi */
            const cek_kuota = await new Promise((resolve, reject) => {
                Connection.query("SELECT COUNT(sp.id_peserta) AS totalpeserta FROM icare_sesi_peserta sp, icare_sesi_vidcall sv WHERE sp.id_sesi = sv.id AND sv.status = 'aktif' AND sv.id_consult_type = '1'", (error, results) => {
                    if(error) { 
                        /** jika error */
                        reject(error);
                    } else {
                        /** jika results */
                        resolve(results);
                    }
                });
            });

            if(cek_kuota[0].totalpeserta < 500){
                /** cekpeserta */
                const cekpeserta = await new Promise((resolve, reject) => {
                    Connection.query("SELECT * FROM cdc_account WHERE id = ? AND account_type IN ('peserta','peserta_event') ", [selectuser], (error, results) => {
                        if(error) { 
                            /** jika error */
                            reject(error);
                        } else {
                            /** jika results */
                            resolve(results);
                        }
                    });
                });
                if(cekpeserta.length > 0){
                    /** cek apakah user sudah ada jawaban atau tidak */
                    const cekjawaban = await new Promise((resolve, reject) => {
                        Connection.query("SELECT * FROM icare_a2assessment WHERE id_account = ? AND id_consult_type = 1", [selectuser], (error, results) => {
                            if(error) { 
                                /** jika error */
                                reject(error);
                            } else {
                                /** jika results */
                                resolve(results);
                            }
                        });
                    });
                    if(cekjawaban.length === 0){
                        /** peserta blm memberikan jawaban */
                        /** get data part */
                        const datapart = await new Promise((resolve, reject) => {
                            Connection.query("SELECT * FROM icare_passessment WHERE id_consult_type = 1",(error, results) => {
                                if(error) { 
                                    /** jika error */
                                    reject(error);
                                } else {
                                    /** jika results */
                                    resolve(results);
                                }
                            });
                        });
                        if(datapart.length > 0){
                            /** Kirim data part */
                            res.status(200).json({
                                datapart: datapart
                            })
                        } else if(datapart.length === 0){
                            /** send error */
                            throw new Error('Data Part/Kualifikasi Kosong');
                        } else {
                            /** send error */
                            throw new Error('Get Data Part/Kualifikasi Error');
                        }
                    } else if(cekjawaban.length > 0){
                        /** peserta sudah memberikan jawaban */
                        /** get sesi pilihan peeserta */
                        const sesi = await new Promise((resolve, reject) => {
                            Connection.query("SELECT * FROM icare_sesi_peserta WHERE id_peserta = ?", [selectuser], (error, results) => {
                                if(error) { 
                                    /** jika error */
                                    reject(error);
                                } else {
                                    /** jika results */
                                    resolve(results);
                                }
                            });
                        });
                        if(sesi.length > 0){
                            /** send notifikasi */
                            // throw new Error('Anda Sudah Menyelesaikan Assessment Awal Konsultasi Karir, Silahkan Cek Terus Email Anda, Link Video Call akan Dikirimkan ke Email Anda, Terima Kasih Atas Partisipasinya');
                            res.status(201).json({ 
                                // message: 'Anda Sudah Menyelesaikan Assessment Awal Konsultasi Karir, Silahkan Cek Terus Email Anda, Link Video Call akan Dikirimkan ke Email Anda, Terima Kasih Atas Partisipasinya', 
                                selectsesi: sesi
                            });
                        } else {
                            /** send error */
                            throw new Error('Get data sesi peserta, error');
                        }


                        
                    } else {
                        /** send error */
                        throw new Error('Cek Jawaban Error');
                    }
                } else if(cekpeserta.length === 0){
                    /** send error */
                    throw new Error('Peserta Tidak Terdaftar');
                } else {
                    /** send error */
                    throw new Error('Cek Peserta Error');
                }

            } else if(cek_kuota[0].totalpeserta >= 500){
                /** send error */
                throw new Error('Mohon maaf, saat ini kuota sudah penuh. Anda tidak dapat mengikuti assessment dan konsultasi psikolog. Terima kasih.');
            } else {
                /** send error */
                throw new Error('Get Cek Kuota Total Peserta Error');
            }

        } catch(e){
            res.status(400).json({ message: e.message });   
        }
    } else {
        res.status(500).json({
            message: 'Field Tidak Boleh Kosong'
        })
    }
})

// Router.post('/listpart', (req, res) => {
//     try {
//         const { selectkonsul, selectuser } = req.body;

//         if(selectkonsul, selectuser){
//             /** cek tipe konsultasi */
//             Connection.query("SELECT * FROM icare_consult_type WHERE id = ? AND NOT status_consult = 'hapus'", [selectkonsul], async (error, pilihkonsul) =>{ 
//                 if(error){
//                     res.status(500).json({
//                         message: error
//                     })
//                 } else if(pilihkonsul.length == 0) {
//                     res.status(403).json({
//                         message: 'Tipe konsul tidak terdaftar'
//                     })
//                 } else if(pilihkonsul.length > 0){
//                     /** cek data peserta */
//                     Connection.query("SELECT * FROM cdc_account WHERE id = ? AND (account_type = 'peserta_event' OR account_type = 'peserta_event') AND NOT account_type = 'nonaktif'", [selectuser], async (error, cekuser) => {
//                         if(error){
//                             res.status(500).json({
//                                 message: error
//                             }) 
//                         } else if(cekuser.length == 0) {
//                             res.status(403).json({
//                                 message: 'Peserta tidak terdaftar'
//                             })
//                         } else if(cekuser.length > 0) {
//                             /** cek apakah tipe konsultasi adalah konsultasi berlanjut atau tidak */
//                             Connection.query("SELECT repeat_consult FROM icare_consult_type WHERE id = ? AND repeat_consult = 'y'", [selectkonsul], async(error, cekrepeat) => {
//                                 if(error){
//                                     res.status(500).json({
//                                         message: error
//                                     }) 
//                                 }
//                                 else if(cekrepeat.length == 0){
//                                     /** tipe konsultasi 1x konsul */
//                                     Connection.query("SELECT * FROM icare_a2assessment WHERE id_account = ? AND id_consult_type = ?", [selectuser, selectkonsul], async (error, cekjawaban) => {
//                                         if(error){
//                                             res.status(500).json({
//                                                 message: error
//                                             }) 
//                                         }
//                                         else if(cekjawaban.length == 0) {
//                                             /** peserta blm memberikan jawaban */
//                                             /** get data part */
//                                             Connection.query("SELECT * FROM icare_passessment WHERE id_consult_type = ?", [selectkonsul], async(error, datapart) => {
//                                                 if(error){
//                                                     res.status(500).json({
//                                                         message: error
//                                                     }) 
//                                                 } else if(datapart.length >= 0){
//                                                     /** get data konsul */
//                                                     Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
//                                                         if(error){
//                                                             res.status(500).json({
//                                                                 message: error
//                                                             }) 
//                                                         } else if(konsul.length >= 0){
//                                                             /** Kirim data part */
//                                                             res.status(200).json({
//                                                                 datapart: datapart,
//                                                                 konsul : konsul,
//                                                                 pilihkonsul: pilihkonsul,
//                                                                 selectkonsul
//                                                             })
//                                                         } else {
//                                                             res.status(500).json({
//                                                                 message: 'Get data konsul error'
//                                                             })
//                                                         }
//                                                     })
//                                                 } else {
//                                                     res.status(500).json({
//                                                         message: 'Get data part error'
//                                                     })
//                                                 }
//                                             })
//                                         }
//                                         else if(cekjawaban.length > 0) {
//                                             /** peserta sudah memberikan jawaban */
//                                             res.status(500).json({
//                                                 message: 'Anda Sudah Menyelesaikan Assessment Ini, terima kasih atas partisipasinya'
//                                             })
//                                         }
//                                     })
//                                 } else if(cekrepeat.length > 0){
//                                     /** tipe konsultasi berulang */
//                                     /** get data part */
//                                     Connection.query("SELECT * FROM icare_passessment WHERE id_consult_type = ?", [selectkonsul], async(error, datapart) => {
//                                         if(error){
//                                             res.status(500).json({
//                                                 message: error
//                                             }) 
//                                         } else if(datapart.length >= 0){
//                                             /** get data konsul */
//                                             Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
//                                                 if(error){
//                                                     res.status(500).json({
//                                                         message: error
//                                                     }) 
//                                                 } else if(konsul.length >= 0){
//                                                     /** Kirim data part */
//                                                     res.status(200).json({
//                                                         datapart: datapart,
//                                                         konsul : konsul,
//                                                         pilihkonsul: pilihkonsul,
//                                                         selectkonsul
//                                                     })
//                                                 } else {
//                                                     res.status(500).json({
//                                                         message: 'Get data konsul error'
//                                                     })
//                                                 }
//                                             })
//                                         } else {
//                                             res.status(500).json({
//                                                 message: 'Get data part error'
//                                             })
//                                         }
//                                     })
//                                 }
//                             })
//                         } else {
//                             res.status(500).json({
//                                 message: 'Get data peserta error'
//                             })
//                         }
//                     })
//                 } else {
//                     res.status(500).json({
//                         message: 'Get data konsul error'
//                     })
//                 }
//             })
//         }
//     }catch (error) {
//         console.log(error);
//     }
// })

Router.post('/listsoalkarir', async (req, res) => {
    const { selectpart } = req.body;

    if(selectpart){
        try{
            /** cek part */
            const cekpart = await new Promise((resolve, reject) => {
                Connection.query("SELECT * FROM icare_passessment WHERE status = 'aktif' AND id = ?", [selectpart], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cekpart.length > 0){
                /** soal */
                const soal = await new Promise((resolve, reject) => {
                    Connection.query("SELECT * FROM icare_q3assessment WHERE status = 'aktif' AND idpart = ?", [selectpart], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                /** sesi */
                const sesi = await new Promise((resolve, reject) => {
                    Connection.query("SELECT sv.id, sv.sesi FROM icare_sesi_vidcall sv WHERE sv.id_consult_type = '1' AND sv.status = 'aktif' AND NOT id IN (SELECT id_sesi FROM icare_sesi_peserta GROUP BY id_sesi HAVING COUNT(*) >= 125)", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                if(soal.length > 0 && sesi.length > 0){
                    /** datapart */
                    const datapart = await new Promise((resolve, reject) => {
                        Connection.query("SELECT * FROM icare_passessment WHERE status = 'aktif' AND id_consult_type = 1", (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(datapart.length > 0) {
                        /** Kirim data soal */
                        res.status(200).json({
                            datapart: datapart,
                            soal: soal,
                            sesi: sesi,
                            selectpart
                        })
                    } else if(datapart.length === 0){
                        /** Send error */
                        throw new Error('Belum Ada Part/Kualifikasi yang Terdaftar');
                    } else {
                        /** Send error */
                        throw new Error('Get Data Part/Kualifikasi Error');
                    }
                } else if(soal.length === 0 && sesi.length === 0){
                    /** Send error */
                    throw new Error('Belum Ada Soal Terdaftar');
                } else {
                    /** Send error */
                    throw new Error('Get Data Soal Error');
                }
            } else if(cekpart.length === 0){
                /** Send error */
                throw new Error('Part/Kualifikasi Tidak Terdaftar');
            } else {
                /** Send error */
                throw new Error('Cek Data Part/Kualifikasi error');
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }                         
    } else {
        /** Field kosong */
        res.status(500).json({
            message: "Field tidak boleh kosong"
        });
    }
})

/** route for list peserta */
Router.post('/kategorilist', async (req, res) => {
    const { kategorilist } = req.body;

    if(kategorilist){
        try{
            if(kategorilist == 1){
                /** get data peserta semua list */
                const all_sesi = await new Promise((resolve, reject) => {
                    Connection.query("SELECT cdc_account.id AS id_peserta, cdc_account.nama AS nama_peserta, cdc_account.email AS email_peserta, icare_sesi_vidcall.sesi AS sesi, icare_passessment.nama AS kategori FROM icare_sesi_peserta LEFT JOIN cdc_account ON cdc_account.id = icare_sesi_peserta.id_peserta LEFT JOIN icare_a2assessment ON icare_a2assessment.id_account = icare_sesi_peserta.id_peserta LEFT JOIN icare_sesi_vidcall ON icare_sesi_vidcall.id = icare_sesi_peserta.id_sesi LEFT JOIN icare_passessment ON icare_passessment.id = icare_a2assessment.idpart GROUP BY icare_sesi_peserta.id", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(all_sesi.length >= 0){
                    /** Kirim data soal */
                    res.status(200).json({
                        data: all_sesi,
                        kategorilist: kategorilist,
                        judul: "Semua Sesi dan Semua Kategori"
                    })
                } else {
                    /** Send error */
                    throw new Error('Proses pengambilan data list peserta gagal');
                }
            }
            else if(kategorilist == 2){
                /** get data peserta sesi 1 */
                const sesisatu = await new Promise((resolve, reject) => {
                    Connection.query("SELECT cdc_account.id AS id_peserta, cdc_account.nama AS nama_peserta, cdc_account.email AS email_peserta, icare_sesi_vidcall.sesi AS sesi, icare_passessment.nama AS kategori FROM icare_sesi_peserta LEFT JOIN cdc_account ON cdc_account.id = icare_sesi_peserta.id_peserta LEFT JOIN icare_a2assessment ON icare_a2assessment.id_account = icare_sesi_peserta.id_peserta LEFT JOIN icare_sesi_vidcall ON icare_sesi_vidcall.id = icare_sesi_peserta.id_sesi LEFT JOIN icare_passessment ON icare_passessment.id = icare_a2assessment.idpart WHERE icare_sesi_peserta.id_sesi = 1 GROUP BY icare_sesi_peserta.id", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(sesisatu.length >= 0){
                    /** Kirim data soal */
                    res.status(200).json({
                        data: sesisatu,
                        kategorilist: kategorilist,
                        judul: "Sesi 1"
                    })
                } else {
                    /** Send error */
                    throw new Error('Proses pengambilan data list peserta gagal');
                }
            }
            else if(kategorilist == 3){
                /** get data peserta sesi 2 */
                const sesidua = await new Promise((resolve, reject) => {
                    Connection.query("SELECT cdc_account.id AS id_peserta, cdc_account.nama AS nama_peserta, cdc_account.email AS email_peserta, icare_sesi_vidcall.sesi AS sesi, icare_passessment.nama AS kategori FROM icare_sesi_peserta LEFT JOIN cdc_account ON cdc_account.id = icare_sesi_peserta.id_peserta LEFT JOIN icare_a2assessment ON icare_a2assessment.id_account = icare_sesi_peserta.id_peserta LEFT JOIN icare_sesi_vidcall ON icare_sesi_vidcall.id = icare_sesi_peserta.id_sesi LEFT JOIN icare_passessment ON icare_passessment.id = icare_a2assessment.idpart WHERE icare_sesi_peserta.id_sesi = 2 GROUP BY icare_sesi_peserta.id", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(sesidua.length >= 0){
                    /** Kirim data soal */
                    res.status(200).json({
                        data: sesidua,
                        kategorilist: kategorilist,
                        judul: "Sesi 2"
                    })
                } else {
                    /** Send error */
                    throw new Error('Proses pengambilan data list peserta gagal');
                }
            }
            else if(kategorilist == 4){
                /** get data peserta sesi 3 */
                const sesitiga = await new Promise((resolve, reject) => {
                    Connection.query("SELECT cdc_account.id AS id_peserta, cdc_account.nama AS nama_peserta, cdc_account.email AS email_peserta, icare_sesi_vidcall.sesi AS sesi, icare_passessment.nama AS kategori FROM icare_sesi_peserta LEFT JOIN cdc_account ON cdc_account.id = icare_sesi_peserta.id_peserta LEFT JOIN icare_a2assessment ON icare_a2assessment.id_account = icare_sesi_peserta.id_peserta LEFT JOIN icare_sesi_vidcall ON icare_sesi_vidcall.id = icare_sesi_peserta.id_sesi LEFT JOIN icare_passessment ON icare_passessment.id = icare_a2assessment.idpart WHERE icare_sesi_peserta.id_sesi = 3 GROUP BY icare_sesi_peserta.id", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(sesitiga.length >= 0){
                    /** Kirim data soal */
                    res.status(200).json({
                        data: sesitiga,
                        kategorilist: kategorilist,
                        judul: "Sesi 3"
                    })
                } else {
                    /** Send error */
                    throw new Error('Proses pengambilan data list peserta gagal');
                }
            }
            else if(kategorilist == 5){
                /** get data peserta sesi 4 */
                const sesiempat = await new Promise((resolve, reject) => {
                    Connection.query("SELECT cdc_account.id AS id_peserta, cdc_account.nama AS nama_peserta, cdc_account.email AS email_peserta, icare_sesi_vidcall.sesi AS sesi, icare_passessment.nama AS kategori FROM icare_sesi_peserta LEFT JOIN cdc_account ON cdc_account.id = icare_sesi_peserta.id_peserta LEFT JOIN icare_a2assessment ON icare_a2assessment.id_account = icare_sesi_peserta.id_peserta LEFT JOIN icare_sesi_vidcall ON icare_sesi_vidcall.id = icare_sesi_peserta.id_sesi LEFT JOIN icare_passessment ON icare_passessment.id = icare_a2assessment.idpart WHERE icare_sesi_peserta.id_sesi = 4 GROUP BY icare_sesi_peserta.id", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(sesiempat.length >= 0){
                    /** Kirim data soal */
                    res.status(200).json({
                        data: sesiempat,
                        kategorilist: kategorilist,
                        judul: "Sesi 4"
                    })
                } else {
                    /** Send error */
                    throw new Error('Proses pengambilan data list peserta gagal');
                }
            }
            else if(kategorilist == 6){
                /** get data peserta pernah bekerja */
                const pernahgawe = await new Promise((resolve, reject) => {
                    Connection.query("SELECT cdc_account.id AS id_peserta, cdc_account.nama AS nama_peserta, cdc_account.email AS email_peserta, icare_sesi_vidcall.sesi AS sesi, icare_passessment.nama AS kategori FROM icare_sesi_peserta LEFT JOIN cdc_account ON cdc_account.id = icare_sesi_peserta.id_peserta LEFT JOIN icare_a2assessment ON icare_a2assessment.id_account = icare_sesi_peserta.id_peserta LEFT JOIN icare_sesi_vidcall ON icare_sesi_vidcall.id = icare_sesi_peserta.id_sesi LEFT JOIN icare_passessment ON icare_passessment.id = icare_a2assessment.idpart WHERE icare_a2assessment.idpart = 1 GROUP BY icare_sesi_peserta.id", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(pernahgawe.length >= 0){
                    /** Kirim data soal */
                    res.status(200).json({
                        data: pernahgawe,
                        kategorilist: kategorilist,
                        judul: "Kategori Pernah Bekerja"
                    })
                } else {
                    /** Send error */
                    throw new Error('Proses pengambilan data list peserta gagal');
                }
            }
            else if(kategorilist == 7){
                /** get data peserta gagal seleksi */
                const gagalseleksi = await new Promise((resolve, reject) => {
                    Connection.query("SELECT cdc_account.id AS id_peserta, cdc_account.nama AS nama_peserta, cdc_account.email AS email_peserta, icare_sesi_vidcall.sesi AS sesi, icare_passessment.nama AS kategori FROM icare_sesi_peserta LEFT JOIN cdc_account ON cdc_account.id = icare_sesi_peserta.id_peserta LEFT JOIN icare_a2assessment ON icare_a2assessment.id_account = icare_sesi_peserta.id_peserta LEFT JOIN icare_sesi_vidcall ON icare_sesi_vidcall.id = icare_sesi_peserta.id_sesi LEFT JOIN icare_passessment ON icare_passessment.id = icare_a2assessment.idpart WHERE icare_a2assessment.idpart = 2 GROUP BY icare_sesi_peserta.id", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(gagalseleksi.length >= 0){
                    /** Kirim data soal */
                    res.status(200).json({
                        data: gagalseleksi,
                        kategorilist: kategorilist,
                        judul: "Kategori Gagal dalam Seleksi"
                    })
                } else {
                    /** Send error */
                    throw new Error('Proses pengambilan data list peserta gagal');
                }
            }
            else if(kategorilist == 8){
                /** get data peserta freshgraduate */
                const freshgraduate = await new Promise((resolve, reject) => {
                    Connection.query("SELECT cdc_account.id AS id_peserta, cdc_account.nama AS nama_peserta, cdc_account.email AS email_peserta, icare_sesi_vidcall.sesi AS sesi, icare_passessment.nama AS kategori FROM icare_sesi_peserta LEFT JOIN cdc_account ON cdc_account.id = icare_sesi_peserta.id_peserta LEFT JOIN icare_a2assessment ON icare_a2assessment.id_account = icare_sesi_peserta.id_peserta LEFT JOIN icare_sesi_vidcall ON icare_sesi_vidcall.id = icare_sesi_peserta.id_sesi LEFT JOIN icare_passessment ON icare_passessment.id = icare_a2assessment.idpart WHERE icare_a2assessment.idpart = 3 GROUP BY icare_sesi_peserta.id", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(freshgraduate.length >= 0){
                    /** Kirim data soal */
                    res.status(200).json({
                        data: freshgraduate,
                        kategorilist: kategorilist,
                        judul: "Kategori Tanpa Pengalaman Bekerja"
                    })
                } else {
                    /** Send error */
                    throw new Error('Proses pengambilan data list peserta gagal');
                }
            } else {
                /** Send error */
                throw new Error('Kategori tidak terdaftar');
            }
        } catch(e){
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** Field kosong */
        res.status(500).json({
            message: "Harap pilih kategori list terlebih dahulu"
        });
    }
})

/** route for hasil assessment karir */
Router.get('/hasilassessmentkarir', async (req, res) => {
    try{
        /** get data sesi */
        const sesi = await new Promise((resolve, reject) => {
            Connection.query("SELECT id AS idsesi, sesi AS namasesi FROM icare_sesi_vidcall WHERE id_consult_type = '1' AND status = 'aktif'", (error, results) => {
                if(error){
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })
        if(sesi.length >= 0){
            /** send data */
            res.status(200).json({
                sesi,
            })
        // } else if(results.length === 0){
        //     /** send error */
        //     throw new Error('Belum Ada Peserta yang Memberikan Jawaban');
        } else {
            /** send error */
            throw new Error('Cek Data Sesi, Error');
        }
    }catch(e){
        /** send error */
        res.status(400).json({ message: e.message });
    }
});

Router.post('/hasilassessmentkarirsesi', async (req, res) => {
    const { selectsesi } = req.body;

    if(selectsesi){
        try{
            /** cek sesi */
            const cek_sesi = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM icare_sesi_vidcall WHERE id = ?", [selectsesi], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_sesi.length > 0){
                /** cekhasilpeserserta */
                const results = await new Promise((resolve, reject) => {
                    Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_sesi_peserta sp, cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = 1 AND NOT u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = 1 AND status = 'aktif') AND NOT u.id IN (SELECT idpeserta FROM icare_roomvidcall WHERE status = 'aktif') AND u.id = sp.id_peserta AND sp.id_sesi = ? AND u.account_type IN ('peserta', 'peserta_event') GROUP BY u.id ORDER BY u.id ASC", [selectsesi], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                const sesi = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id AS idsesi, sesi AS namasesi FROM icare_sesi_vidcall WHERE id_consult_type = '1' AND status = 'aktif'", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(results.length >= 0 && sesi.length >= 0){
                    /** send data */
                    res.status(200).json({
                        results, sesi, selectsesi
                    })
                // } else if(results.length === 0){
                //     /** send error */
                //     throw new Error('Belum Ada Peserta yang Memberikan Jawaban');
                } else {
                    /** send error */
                    throw new Error('Cek Hasil Jawaban Peserta Error');
                }
            } else {
                /** send error */
                throw new Error('Sesi tidak terdaftar');
            }
        }catch(e){
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        res.status(500).json({
            message: "Field tidak boleh kosong"
        });
    }
});

Router.post('/hasilassessmentkarirpeserta', async (req, res) => {
const { selectpeserta, selectsesi } = req.body;

if(selectpeserta && selectsesi){
    try{
        /** cek apakah peserta sedang aktif di video call */
        const cekpesertaaktif = await new Promise((resolve, reject) => {
            Connection.query(" SELECT id from icare_roomvidcall WHERE idpeserta = ? AND status = 'aktif' ", [selectpeserta], (error, results) => {
                if(error){
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })
        if(cekpesertaaktif.length === 0){
            /** cekpeserta */
            const cekpeserta = await new Promise((resolve, reject) => {
                Connection.query(" SELECT id from cdc_account WHERE id = ? AND account_type IN ('peserta','peserta_event') ", [selectpeserta], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })

            /** cek sesi */
            const cek_sesi = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM icare_sesi_vidcall WHERE id = ?", [selectsesi], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cekpeserta.length > 0 && cek_sesi.length > 0){
                /** get data jawaban peserta */
                const results = await new Promise((resolve, reject) => {
                    Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, p.pertanyaan AS pertanyaan, j.jawaban AS jawaban, j.jawaban_essay AS jawaban_essay, p.sub_pertanyaan AS sub_pertanyaan, j.sub_jawaban AS sub_jawaban FROM cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = 1 AND u.id = ? AND u.account_type IN ('peserta','peserta_event')", [selectpeserta], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(results.length >= 0){
                    /** get data peserta yg sudah menjawab dan blm ada kesimpulan */
                    const peserta = await new Promise((resolve, reject) => {
                        Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_sesi_peserta sp, cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = 1 AND NOT u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = 1 AND status = 'aktif') AND NOT u.id IN (SELECT idpeserta FROM icare_roomvidcall WHERE status = 'aktif') AND u.id = sp.id_peserta AND sp.id_sesi = ? AND u.account_type IN ('peserta', 'peserta_event') GROUP BY u.id ORDER BY u.id ASC", [selectsesi], (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })

                    const sesi = await new Promise((resolve, reject) => {
                        Connection.query("SELECT id AS idsesi, sesi AS namasesi FROM icare_sesi_vidcall WHERE id_consult_type = '1' AND status = 'aktif'", (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(peserta.length > 0 && sesi.length > 0) {
                        /** get bioadata peserta */
                        const biodata = await new Promise((resolve, reject) => {
                            Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, u.tempat_lahir AS tempat_lahir, u.tanggal_lahir AS tanggal_lahir, u.jenis_kelamin AS jenis_kelamin, u.pendidikan AS pendidikan_terakhir, u.universitas AS asal_universitas, u.jurusan AS jurusan, u.phone AS phone FROM cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = 1 AND u.id = ? AND u.account_type IN ('peserta','peserta_event') GROUP BY u.id", [selectpeserta], (error, results) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve(results)
                                }
                            })
                        })
                        if(biodata.length >= 0){
                            /** send data */
                            res.status(200).json({
                                results, peserta, selectpeserta, biodata, sesi, selectsesi
                            });
                        } else {
                            /** send error */
                            throw new Error('Get Biodata Peserta Error');
                        }
                    } else if(peserta.length === 0){
                        /** send error */
                        throw new Error('Belum Ada Peserta yang Memberikan Jawaban');
                    } else {
                        /** send error */
                        throw new Error('Get Data Peserta yang Sudah Memberikan Jawaban Error');
                    }
                } else {
                    /** send error */
                    throw new Error('Get Data Jawaban Peserta Error');
                }
            } else if(cekpeserta.length === 0 && cek_sesi.length === 0){
                /** send error */
                throw new Error('Peserta Atau Sesi Tidak Terdaftar');
            } else {
                /** send error */
                throw new Error('Cek Peserta Atau Sesi Error');
            }
        } else if(cekpesertaaktif.length === 1){
            /** send error */
            throw new Error('Peserta sedang video call dengan konsultan lain');
        } else {
            /** send error */
            throw new Error('Get Data Peserta yang sedang aktif video call, Error');
        }
    }catch(e){
        /** send error */
        res.status(400).json({ message: e.message });
    }                                   
} else {
    res.status(500).json({
        message: "Field tidak boleh kosong"
    });
}
});

Router.get('/kesimpulanassessmentkarir', async (req, res) => {
    try{
        /** get data sesi */
        const sesi = await new Promise((resolve, reject) => {
            Connection.query("SELECT id AS idsesi, sesi AS namasesi FROM icare_sesi_vidcall WHERE id_consult_type = '1' AND status = 'aktif'", (error, results) => {
                if(error){
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })
        if(sesi.length >= 0){
            /** send data */
            res.status(200).json({
                sesi,
            })
        // } else if(cekkesimpulan.length === 0){
        //     /** send error */
        //     throw new Error('Belum Ada Peserta yang Diberikan Kesimpulan');
        } else {
            /** send error */
            throw new Error('Get Data Sesi, Error');
        }
    } catch(e){
        /** send error */
        res.status(400).json({ message: e.message });
    }
    });

Router.post('/kesimpulanassessmentkarirsesi', async (req, res) => {
    const { selectsesi } = req.body;

    if(selectsesi){
        try{
            /** cek sesi */
            const cek_sesi = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM icare_sesi_vidcall WHERE id = ?", [selectsesi], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_sesi.length > 0){
                /** cek peserta yang sudah mendapatkan kesimpulan */
                const cekkesimpulan = await new Promise((resolve, reject) => {
                    Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_sesi_peserta sp, cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = 1 AND u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = 1 AND status = 'aktif') AND u.id = sp.id_peserta AND sp.id_sesi = ? AND u.account_type IN ('peserta','peserta_event') GROUP BY u.id ORDER BY u.id ASC", [selectsesi], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                const sesi = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id AS idsesi, sesi AS namasesi FROM icare_sesi_vidcall WHERE id_consult_type = '1' AND status = 'aktif'", (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(cekkesimpulan.length >= 0 && sesi.length >0){
                    /** send data */
                    res.status(200).json({
                        cekkesimpulan, selectsesi, sesi
                    })
                // } else if(cekkesimpulan.length === 0){
                //     /** send error */
                //     throw new Error('Belum Ada Peserta yang Diberikan Kesimpulan');
                } else {
                    /** send error */
                    throw new Error('Get Data Peserta yang Sudah Mendapatkan Kesimpulan Error');
                }
            } else {
                /** send error */
                throw new Error('Get Data Sesi, Error');
            }
        
        } catch(e){
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        res.status(500).json({
            message: "Field tidak boleh kosong"
        });
    }
});

Router.post('/kesimpulanassessmentkarirpeserta', async (req, res) => {
    const { selectpeserta, selectsesi } = req.body;

    if(selectpeserta && selectsesi){
        try{
            /** cek apakah peserta sedang aktif di video call */
            const cekpesertaaktif = await new Promise((resolve, reject) => {
                Connection.query(" SELECT id from icare_roomvidcall WHERE idpeserta = ? AND status = 'aktif' ", [selectpeserta], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cekpesertaaktif.length === 0){
                /** cekpeserta */
                const cekpeserta = await new Promise((resolve, reject) => {
                    Connection.query(" SELECT id from cdc_account WHERE id = ? AND account_type IN ('peserta','peserta_event')", [selectpeserta], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                /** cek sesi */
                const cek_sesi = await new Promise((resolve, reject) => {
                    Connection.query("SELECT id FROM icare_sesi_vidcall WHERE id = ?", [selectsesi], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(cekpeserta.length > 0 && cek_sesi.length > 0){
                    /** get data jawaban peserta berdasarkan acara terpilih */
                    const results = await new Promise((resolve, reject) => {
                        Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, p.pertanyaan AS pertanyaan, j.jawaban AS jawaban, j.jawaban_essay AS jawaban_essay, p.sub_pertanyaan AS sub_pertanyaan, j.sub_jawaban AS sub_jawaban FROM cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = 1 AND u.id = ? AND u.account_type IN ('peserta','peserta_event')", [selectpeserta], async (error, results)=>{
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(results.length >= 0){
                        /** get data peserta yg sudah menjawab dan ada kesimpulan */
                        const peserta = await new Promise((resolve, reject) => {
                            Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_sesi_peserta sp, cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = 1 AND u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = 1 AND status = 'aktif') AND u.id = sp.id_peserta AND sp.id_sesi = ? AND u.account_type IN ('peserta','peserta_event') GROUP BY u.id ORDER BY u.id ASC", [selectsesi], async (error, results)=>{
                                if(error){
                                    reject(error)
                                } else {
                                    resolve(results)
                                }
                            })
                        })

                        /** data sesi */
                        const sesi = await new Promise((resolve, reject) => {
                            Connection.query("SELECT id AS idsesi, sesi AS namasesi FROM icare_sesi_vidcall WHERE id_consult_type = '1' AND status = 'aktif'", (error, results) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve(results)
                                }
                            })
                        })
                        if(peserta.length > 0 && sesi.length > 0){
                            /** get data kesimpulan peserta */
                            const datakesimpulan = await new Promise((resolve, reject) => {
                                Connection.query("SELECT k.id AS idkesimpulan, k.id_consult_type AS idkonsul, a.nama AS tipekonsul, k.verified_by AS idpsikolog, p.nama AS namapsikolog, k.id_account AS idpeserta, k.conc AS kesimpulan FROM icare_conc k INNER JOIN icare_consult_type a ON a.id = k.id_consult_type INNER JOIN cdc_account p ON p.id = k.verified_by WHERE k.id_consult_type = 1 AND k.id_account = ? AND NOT k.status = 'hapus' ", [selectpeserta], async (error, results)=>{
                                    if(error){
                                        reject(error)
                                    } else {
                                        resolve(results)
                                    }
                                })
                            })
                            if(datakesimpulan.length >= 0){
                                /** get biodata peserta */
                                const biodata = await new Promise((resolve, reject) => {
                                    Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, u.tempat_lahir AS tempat_lahir, u.tanggal_lahir AS tanggal_lahir, u.jenis_kelamin AS jenis_kelamin, u.pendidikan AS pendidikan_terakhir, u.universitas AS asal_universitas, u.jurusan AS jurusan, u.phone AS phone FROM cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = 1 AND u.id = ? AND u.account_type IN ('peserta','peserta_event') GROUP BY u.id", [selectpeserta], async (error, results)=>{
                                        if(error){
                                            reject(error)
                                        } else {
                                            resolve(results)
                                        }
                                    })
                                })
                                if(datakesimpulan.length >= 0) {
                                    /** Send Data */
                                    res.status(200).json({
                                        results, peserta, selectpeserta, datakesimpulan, biodata, sesi, selectsesi
                                    });
                                } else {
                                    /** send error */
                                    throw new Error('Get Biodata Peserta Error');
                                }
                            } else {
                                /** send error */
                                throw new Error('Get Data Kesimpulan Error');
                            }
                        } else if(peserta.length === 0){
                            /** send error */
                            throw new Error('Belum Ada Peserta yang DIberikan Kesimpulan');
                        } else {
                            /** send error */
                            throw new Error('Get Data Peserta yang Sudah Diberikan Kesimpulan Error');
                        }
                    } else {
                        /** send error */
                        throw new Error('Get Data Jawaban Peserta Error');
                    }
                } else if(cekpeserta.length === 0 && cek_sesi.length === 0){
                    /** send error */
                    throw new Error('Peserta atau Sesi Tidak Terdaftar');
                } else {
                    /** send error */
                    throw new Error('Cek Peserta atau Sesi Error');
                }
            } else if(cekpesertaaktif.length === 1){
                /** send error */
                throw new Error('Peserta sedang video call dengan konsultan lain');
            } else {
                /** send error */
                throw new Error('Get Data Peserta yang sedang aktif video call, Error');
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        res.status(500).json({
            message: "Field tidak boleh kosong"
        });
    }
});

/** Route peserta melihat kesimpulan */
Router.post('/lihatkesimpulankarirpeserta', async (req, res) =>{
    const { selectpeserta } = req.body;
    if(selectpeserta){
        try{
            /** cekpeserta */
            const cekpeserta = await new Promise((resolve, reject) => {
                Connection.query("SELECT id from cdc_account WHERE id = ? AND account_type IN ('peserta','peserta_event')", [selectpeserta], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cekpeserta.length > 0){
                /** cek apakah user sudah di berikan kesimpulan */
                const cek_kesimpulan = await new Promise((resolve, reject) => {
                    Connection.query(" SELECT c.id_account AS namapeserta, c.verified_by AS idpsikolog, a.nama AS namapsikolog FROM icare_conc c, cdc_account a WHERE c.id_consult_type = '1' AND c.id_account = ? AND c.status = 'aktif' AND c.verified_by = a.id ", [selectpeserta], async (error, results)=>{
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                if(cek_kesimpulan.length > 0){
                    /** cek apakah peserta sudah memeberikan survey */
                    const cek_rating = await new Promise((resolve, reject) => {
                        Connection.query(" SELECT * FROM icare_rating WHERE idpeserta = ? AND status = 'aktif' AND id_consult_type = '1' ", [selectpeserta], async (error, results)=>{
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })

                    if(cek_rating.length > 0){
                        /** get data jawaban peserta berdasarkan acara terpilih */
                        const results = await new Promise((resolve, reject) => {
                            Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, p.pertanyaan AS pertanyaan, j.jawaban AS jawaban, j.jawaban_essay AS jawaban_essay, p.sub_pertanyaan AS sub_pertanyaan, j.sub_jawaban AS sub_jawaban FROM cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = 1 AND u.id = ?", [selectpeserta], async (error, results)=>{
                                if(error){
                                    reject(error)
                                } else {
                                    resolve(results)
                                }
                            })
                        })
                        if(results.length >= 0){
                            /** get data peserta yg sudah menjawab dan ada kesimpulan */
                            const peserta = await new Promise((resolve, reject) => {
                                Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = 1 AND u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = 1 AND status = 'aktif') AND u.account_type IN ('peserta','peserta_event') GROUP BY u.id", async (error, results)=>{
                                    if(error){
                                        reject(error)
                                    } else {
                                        resolve(results)
                                    }
                                })
                            })
                            if(peserta.length > 0){
                                /** get data kesimpulan peserta */
                                const datakesimpulan = await new Promise((resolve, reject) => {
                                    Connection.query("SELECT k.id AS idkesimpulan, k.id_consult_type AS idkonsul, a.nama AS tipekonsul, k.verified_by AS idpsikolog, p.nama AS namapsikolog, k.id_account AS idpeserta, k.conc AS kesimpulan FROM icare_conc k INNER JOIN icare_consult_type a ON a.id = k.id_consult_type INNER JOIN cdc_account p ON p.id = k.verified_by WHERE k.id_consult_type = 1 AND k.id_account = ? AND NOT k.status = 'hapus'", [selectpeserta], async (error, results)=>{
                                        if(error){
                                            reject(error)
                                        } else {
                                            resolve(results)
                                        }
                                    })
                                })
                                if(datakesimpulan.length > 0){
                                    /** get biodata peserta */
                                    const biodata = await new Promise((resolve, reject) => {
                                        Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, u.tempat_lahir AS tempat_lahir, u.tanggal_lahir AS tanggal_lahir, u.jenis_kelamin AS jenis_kelamin, u.pendidikan AS pendidikan_terakhir, u.universitas AS asal_universitas, u.jurusan AS jurusan, u.phone AS phone FROM cdc_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = 1 AND u.id = ? AND u.account_type IN ('peserta','peserta_event') GROUP BY u.id", [selectpeserta], async (error, results)=>{
                                            if(error){
                                                reject(error)
                                            } else {
                                                resolve(results)
                                            }
                                        })
                                    })
                                    if(datakesimpulan.length >= 0) {
                                        /** Send Data */
                                        const rating = "false"
                                        res.status(200).json({
                                            results, peserta, selectpeserta, datakesimpulan, biodata, rating
                                        });
                                    } else {
                                        /** send error */
                                        throw new Error('Get Biodata Peserta Error');
                                    }
                                } else if(datakesimpulan.length == 0) {
                                    /** send error */
                                    throw new Error('Assessment Anda Belum Diberikan Kesimpulan atau Anda Belum Melakukan Asessment Awal');
                                } else {
                                    /** send error */
                                    throw new Error('Get Data Kesimpulan Error');
                                }
                            } else if(peserta.length == 0){
                                /** send error */
                                throw new Error('Assessment Anda Belum Diberikan Kesimpulan');
                            } else {
                                /** send error */
                                throw new Error('Get Data Peserta yang Sudah Diberikan Kesimpulan Error');
                            }
                        } else {
                            /** send error */
                            throw new Error('Get Data Jawaban Peserta Error');
                        }



                    } else if(cek_rating.length == 0){
                        /** Send Data to insert rating */
                        const rating = "true"
                        res.status(200).json({
                            selectpeserta, rating, cek_kesimpulan
                        });
                    } else {
                        throw new Error('Get Data Rating dari Peserta Error');
                    }



                } else if(cek_kesimpulan.length == 0){
                    /** send error */
                    throw new Error('Anda Belum Diberikan Kesimpulan oleh Psikolog Kami, harap tunggu sesaat lagi');
                } else {
                    /** send error */
                    throw new Error('Get Data Peserta yang Sudah Diberikan Kesimpulan Error');
                }
            } else if(cekpeserta.length == 0){
                /** send error */
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
        res.status(500).json({
            message: "Field tidak boleh kosong"
        });
    }
})

/** start of sapa konsep */
/** list pertanyaan SAPA */
Router.post('/listpertanyaankepribadian', async (req, res) =>{
    const { idu } = req.body;
    if(idu){
        try{
            /** cek apakah user sudah ada jawaban di part 1 */
            const cek_part1 = await new Promise((resolve, reject) => {
                Connection.query(" select cdc_account.nama, t_part.id, t_part.nama from t_answer, t_part, t_soal, cdc_account where cdc_account.id = ? AND t_part.id = 1 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND cdc_account.id = t_answer.iduser AND t_answer.idacara = 3 AND cdc_account.account_type IN ('peserta','peserta_event') GROUP BY t_part.id ", [idu] , (error, cek_jawaban1) => {
                    if(error) { 
                        /** jika error */
                        reject(error);
                    } else {
                        /** jika results */
                        resolve(cek_jawaban1);
                    }
                });
            });

            if(cek_part1.length === 0){
                /** jika tidak ada jawaban di part 1, tampil pertanyaan part 1 */
                const pertanyaan_part1 = await new Promise((resolve, reject) => {
                    Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 1 ORDER BY t_soal.id ASC', async (error, resultspart1) => {
                        if(error) { 
                            /** jika error */
                            reject(error);
                        } else {
                            /** jika results */
                            resolve(resultspart1);
                        }
                    })
                })

                if(pertanyaan_part1.length >= 0){
                    /** kirim data */
                    res.status(201).json({ pertanyaan_part1, partpertanyaan : "1" });
                } else {
                    /** jika error lainnya */
                    throw new Error('Get Pertanyaan Part 1 Error');
                }
            } else if(cek_part1.length > 0){
                /** jika user sudah menjawab part 1, cek jawaban di part 2 */
                const cek_part2 = await new Promise((resolve, reject) => {
                    Connection.query(" select cdc_account.nama, t_part.id, t_part.nama from t_answer, t_part, t_soal, cdc_account where cdc_account.id = ? AND t_part.id = 2 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND cdc_account.id = t_answer.iduser AND t_answer.idacara = 3 AND cdc_account.account_type IN ('peserta','peserta_event') GROUP BY t_part.id ", [idu] , (error, cek_jawaban2) => {
                        if(error) { 
                            /** jika error */
                            reject(error);
                        } else {
                            /** jika results */
                            resolve(cek_jawaban2);
                        }
                    });
                });
                
                if(cek_part2.length === 0){
                    /** jika tidak ada jawaban di part 2, tampil pertanyaan part 2 */
                    const pertanyaan_part2 = await new Promise((resolve, reject) => {
                        Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 2 ORDER BY t_soal.id ASC', async (error, resultspart2) => {
                            if(error) { 
                                /** jika error */
                                reject(error);
                            } else {
                                /** jika results */
                                resolve(resultspart2);
                            }
                        })
                    })
    
                    if(pertanyaan_part2.length >= 0){
                        /** kirim data */
                        res.status(201).json({ pertanyaan_part2, partpertanyaan : "2" });
                    } else {
                        /** jika error lainnya */
                        throw new Error('Get Pertanyaan Part 2 Error');
                    }
                } else if(cek_part2.length > 0){
                    /** jika user sudah menjawab part 2 pada acara terpilih, cek jawaban di part 3 */
                    const cek_part3 = await new Promise((resolve, reject) => {
                        Connection.query(" select cdc_account.nama, t_part.id, t_part.nama from t_answer, t_part, t_soal, cdc_account where cdc_account.id = ? AND t_part.id = 3 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND cdc_account.id = t_answer.iduser AND t_answer.idacara = 3 AND cdc_account.account_type IN ('peserta','peserta_event') GROUP BY t_part.id ", [idu] , (error, cek_jawaban3) => {
                            if(error) { 
                                /** jika error */
                                reject(error);
                            } else {
                                /** jika results */
                                resolve(cek_jawaban3);
                            }
                        });
                    });
                    
                    if(cek_part3.length === 0){
                        /** jika tidak ada jawaban di part 3, tampil pertanyaan part 3 */
                        const pertanyaan_part3 = await new Promise((resolve, reject) => {
                            Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 3 ORDER BY t_soal.id ASC', async (error, resultspart3) => {
                                if(error) { 
                                    /** jika error */
                                    reject(error);
                                } else {
                                    /** jika results */
                                    resolve(resultspart3);
                                }
                            })
                        })
        
                        if(pertanyaan_part3.length >= 0){
                            /** kirim data */
                            res.status(201).json({ pertanyaan_part3, partpertanyaan : "3" });
                        } else {
                            /** jika error lainnya */
                            throw new Error('Get Pertanyaan Part 3 Error');
                        }
                    } else if(cek_part3.length > 0){
                        /** jika user sudah menjawab part 3 pada acara terpilih, cek jawaban di part 4 */
                        const cek_part4 = await new Promise((resolve, reject) => {
                            Connection.query(" select cdc_account.nama, t_part.id, t_part.nama from t_answer, t_part, t_soal, cdc_account where cdc_account.id = ? AND t_part.id = 4 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND cdc_account.id = t_answer.iduser AND t_answer.idacara = 3 AND cdc_account.account_type IN ('peserta','peserta_event') GROUP BY t_part.id ", [idu] , (error, cek_jawaban4) => {
                                if(error) { 
                                    /** jika error */
                                    reject(error);
                                } else {
                                    /** jika results */
                                    resolve(cek_jawaban4);
                                }
                            });
                        });

                        if(cek_part4.length === 0) {
                            /** jika tidak ada jawaban di part 4, tampil pertanyaan part 4 */
                            const pertanyaan_part4 = await new Promise((resolve, reject) => {
                                Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 4 ORDER BY t_soal.id ASC', async (error, resultspart4) => {
                                    if(error) { 
                                        /** jika error */
                                        reject(error);
                                    } else {
                                        /** jika results */
                                        resolve(resultspart4);
                                    }
                                })
                            })
            
                            if(pertanyaan_part4.length >= 0){
                                /** kirim data */
                                res.status(201).json({ pertanyaan_part4, partpertanyaan : "4" });
                            } else {
                                /** jika error lainnya */
                                throw new Error('Get Pertanyaan Part 4 Error');
                            }
                        } else if(cek_part4.length > 0) {
                            /** jika user sudah menjawab part 4 pada acara terpilih, cek jawaban di part 5 */
                            const cek_part5 = await new Promise((resolve, reject) => {
                                Connection.query(" select cdc_account.nama, t_part.id, t_part.nama from t_answer, t_part, t_soal, cdc_account where cdc_account.id = ? AND t_part.id = 5 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND cdc_account.id = t_answer.iduser AND t_answer.idacara = 3 AND cdc_account.account_type IN ('peserta','peserta_event') GROUP BY t_part.id ", [idu] , (error, cek_jawaban5) => {
                                    if(error) { 
                                        /** jika error */
                                        reject(error);
                                    } else {
                                        /** jika results */
                                        resolve(cek_jawaban5);
                                    }
                                });
                            });

                            if(cek_part5.length === 0) {
                                /** jika tidak ada jawaban di part 5, tampil pertanyaan part 5 */
                                const pertanyaan_part5 = await new Promise((resolve, reject) => {
                                    Connection.query('SELECT t_soal.id AS idsoal, t_soal.soal AS soal, t_soal.tipe AS tipe, t_soal.skormax AS skormax FROM t_soal INNER JOIN t_part ON t_soal.idpart = t_part.id INNER JOIN t_aspek ON t_soal.idaspek = t_aspek.id WHERE t_part.id = 5 ORDER BY t_soal.id ASC', async (error, resultspart5) => {
                                        if(error) { 
                                            /** jika error */
                                            reject(error);
                                        } else {
                                            /** jika results */
                                            resolve(resultspart5);
                                        }
                                    })
                                })
                
                                if(pertanyaan_part5.length >= 0){
                                    /** kirim data */
                                    res.status(201).json({ pertanyaan_part5, partpertanyaan : "5" });
                                } else {
                                    /** jika error lainnya */
                                    throw new Error('Get Pertanyaan Part 5 Error');
                                }
                            } else if(cek_part5.length > 0) {
                                    /** jika user sudah menjawab part 5 pada acara terpilih, kirim notif test selesai */
                                    /** kirim data */
                                    res.status(201).json({ message: 'Assessment Awal Konsultasi Kepribadian Selesai, Terima kasih Atas Partisipasinya'});
                            } else {
                                /** jika error lainnya */
                                throw new Error('Cek Part 5 Error');
                            }

                        } else {
                            /** jika error lainnya */
                            throw new Error('Cek Part 4 Error');
                        }
                    } else {
                        /** jika error lainnya */
                        throw new Error('Cek Part 3 Error');
                    }
                } else {
                    /** jika error lainnya */
                    throw new Error('Cek Part 2 Error');
                }

            } else {
                /** jika error lainnya */
                throw new Error('Cek Part 1 Error');
            }

        } catch(e) {
            res.status(400).json({ message: e.message });    
        }
    } else {
        res.status(400).json({ message: 'Field tidak boleh kosong' });
    }
})

/** list part SAPA */
Router.get('/skoringpart', async (req, res) => {
    try{
        /** get data part */
        const getpart = await new Promise((resolve, reject) => {
            Connection.query("SELECT id, nama FROM t_part WHERE status = 'aktif' ", (error, results) => {
                if(error){
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })

        if(getpart.length >= 0){
            /** send data */
            res.status(201).json({
                getpart
            });
        } else {
            throw new Error('Error get data part');
        }
    }catch (e) {
        /** kirim error */
        res.status(400).json({ message: e.message });
    }
})

/** skoring assessment */
Router.post('/skorassessment2', async (req, res) =>{
    const {selectpart} = req.body;

    if(selectpart) {
        try{
            /** cek part */
            const cek_part = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM t_part WHERE id = ?", [selectpart], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })

            const getpart = await new Promise((resolve, reject) => {
                Connection.query("SELECT id, nama FROM t_part WHERE status = 'aktif' ", (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })

            if(cek_part.length > 0 && getpart.length >= 0){
                var partnumber = cek_part[0].id;
                /** part terdaftar */
                /** get data skoring */
                if(partnumber == '1'){
                    /** get skoring part 1 */
                    const part = await new Promise((resolve, reject) => {
                        Connection.query("SELECT nama, tanggal_lahir, sum(IF(idsoal = '1', jawab, 0)) AS '1', sum(IF(idsoal = '2', jawab, 0)) AS '2', sum(IF(idsoal = '3', jawab, 0)) AS '3', sum(IF(idsoal = '4', jawab, 0)) AS '4', sum(IF(idsoal = '5', jawab, 0)) AS '5', sum(IF(idsoal = '6', jawab, 0)) AS '6', sum(IF(idsoal = '7', jawab, 0)) AS '7', sum(IF(idsoal = '8', jawab, 0)) AS '8', sum(IF(idsoal = '9', jawab, 0)) AS '9', sum(IF(idsoal = '10', jawab, 0)) AS '10', sum(IF(idsoal = '11', jawab, 0)) AS '11', sum(IF(idsoal = '12', jawab, 0)) AS '12', sum(IF(idsoal = '13', jawab, 0)) AS '13', sum(IF(idsoal = '14', jawab, 0)) AS '14', sum(IF(idsoal = '15', jawab, 0)) AS '15', sum(IF(idsoal < 16, jawab, 0)) AS Jumlah FROM t_answer JOIN cdc_account ON t_answer.iduser = cdc_account.id WHERE t_answer.idacara = 3 GROUP BY cdc_account.id", (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })

                    if(part.length >= 0) {
                        /** send data */
                        res.status(200).json({
                            part, selectpart, getpart
                        })
                    } else {
                        /** send error */
                        throw new Error("Gagal get skor")
                    }
                } else if(partnumber == '2'){
                    /** get skoring part 2 */
                    const part = await new Promise((resolve, reject) => {
                        Connection.query("SELECT nama, tanggal_lahir, sum(IF(idsoal = '16', jawab, 0)) AS '1', sum(IF(idsoal = '17', jawab, 0)) AS '2', sum(IF(idsoal = '18', jawab, 0)) AS '3', sum(IF(idsoal = '19', jawab, 0)) AS '4', sum(IF(idsoal = '20', jawab, 0)) AS '5', sum(IF(idsoal = '21', jawab, 0)) AS '6', sum(IF(idsoal = '22', jawab, 0)) AS '7', sum(IF(idsoal = '23', jawab, 0)) AS '8', sum(IF(idsoal = '24', jawab, 0)) AS '9', sum(IF(idsoal = '25', jawab, 0)) AS '10', sum(IF(idsoal = '26', jawab, 0)) AS '11', sum(IF(idsoal = '27', jawab, 0)) AS '12', sum(IF(idsoal = '28', jawab, 0)) AS '13', sum(IF(idsoal = '29', jawab, 0)) AS '14', sum(IF(idsoal = '30', jawab, 0)) AS '15', sum(IF(idsoal = '31', jawab, 0)) AS '16', sum(IF(idsoal = '32', jawab, 0)) AS '17', sum(IF(idsoal = '33', jawab, 0)) AS '18', sum(IF(idsoal = '34', jawab, 0)) AS '19', sum(IF(idsoal = '35', jawab, 0)) AS '20', sum(IF(idsoal < 36 AND idsoal > 15, jawab, 0)) AS Jumlah FROM t_answer JOIN cdc_account ON t_answer.iduser = cdc_account.id WHERE t_answer.idacara = 3 GROUP BY cdc_account.id", (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })

                    if(part.length >= 0) {
                        /** send data */
                        res.status(200).json({
                            part, selectpart, getpart 
                        })
                    } else {
                        /** send error */
                        throw new Error("Gagal get skor")
                    }
                } else if(partnumber == '3'){
                    /** get skoring part 3 */
                    const part = await new Promise((resolve, reject) => {
                        Connection.query("SELECT nama, tanggal_lahir, sum(IF(idsoal = '36', jawab, 0)) AS '1', sum(IF(idsoal = '37', jawab, 0)) AS '2', sum(IF(idsoal = '38', jawab, 0)) AS '3', sum(IF(idsoal = '39', jawab, 0)) AS '4', sum(IF(idsoal = '40', jawab, 0)) AS '5', sum(IF(idsoal = '41', jawab, 0)) AS '6', sum(IF(idsoal = '42', jawab, 0)) AS '7', sum(IF(idsoal = '43', jawab, 0)) AS '8', sum(IF(idsoal = '44', jawab, 0)) AS '9', sum(IF(idsoal = '45', jawab, 0)) AS '10', sum(IF(idsoal = '46', jawab, 0)) AS '11', sum(IF(idsoal = '47', jawab, 0)) AS '12', sum(IF(idsoal = '48', jawab, 0)) AS '13', sum(IF(idsoal = '49', jawab, 0)) AS '14', sum(IF(idsoal > 35 AND idsoal < 50, jawab, 0)) AS Jumlah FROM t_answer JOIN cdc_account ON t_answer.iduser = cdc_account.id WHERE t_answer.idacara = 3 GROUP BY cdc_account.id", (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })

                    if(part.length >= 0) {
                        /** send data */
                        res.status(200).json({
                            part, selectpart, getpart 
                        })
                    } else {
                        /** send error */
                        throw new Error("Gagal get skor")
                    }
                } else if(partnumber == '4'){
                    /** get skoring part 4 */
                    const part = await new Promise((resolve, reject) => {
                        Connection.query("SELECT nama, tanggal_lahir, sum(IF(idsoal = '50', jawab, 0)) AS '1', sum(IF(idsoal = '51', jawab, 0)) AS '2', sum(IF(idsoal = '52', jawab, 0)) AS '3', sum(IF(idsoal = '53', jawab, 0)) AS '4', sum(IF(idsoal = '54', jawab, 0)) AS '5', sum(IF(idsoal = '55', jawab, 0)) AS '6', sum(IF(idsoal = '56', jawab, 0)) AS '7', sum(IF(idsoal = '57', jawab, 0)) AS '8', sum(IF(idsoal = '58', jawab, 0)) AS '9', sum(IF(idsoal = '59', jawab, 0)) AS '10', sum(IF(idsoal = '60', jawab, 0)) AS '11', sum(IF(idsoal = '61', jawab, 0)) AS '12', sum(IF(idsoal = '62', jawab, 0)) AS '13', sum(IF(idsoal = '63', jawab, 0)) AS '14', sum(IF(idsoal = '64', jawab, 0)) AS '15', sum(IF(idsoal = '65', jawab, 0)) AS '16', sum(IF(idsoal = '66', jawab, 0)) AS '17', sum(IF(idsoal = '67', jawab, 0)) AS '18', sum(IF(idsoal = '68', jawab, 0)) AS '19', sum(IF(idsoal = '69', jawab, 0)) AS '20', sum(IF(idsoal < 70 AND idsoal > 49, jawab, 0)) AS Jumlah FROM t_answer JOIN cdc_account ON t_answer.iduser = cdc_account.id WHERE t_answer.idacara = 3 GROUP BY cdc_account.id", (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })

                    if(part.length >= 0) {
                        /** send data */
                        res.status(200).json({
                            part, selectpart, getpart 
                        })
                    } else {
                        /** send error */
                        throw new Error("Gagal get skor")
                    }
                } else if(partnumber == '5'){
                    /** get skoring part 5 */
                    const part = await new Promise((resolve, reject) => {
                        Connection.query("SELECT nama, tanggal_lahir, sum(IF(idsoal = '70', jawab, 0)) AS '1', sum(IF(idsoal = '71', jawab, 0)) AS '2', sum(IF(idsoal = '72', jawab, 0)) AS '3', sum(IF(idsoal = '73', jawab, 0)) AS '4', sum(IF(idsoal = '74', jawab, 0)) AS '5', sum(IF(idsoal = '75', jawab, 0)) AS '6', sum(IF(idsoal = '76', jawab, 0)) AS '7', sum(IF(idsoal = '77', jawab, 0)) AS '8', sum(IF(idsoal = '78', jawab, 0)) AS '9', sum(IF(idsoal = '79', jawab, 0)) AS '10', sum(IF(idsoal = '80', jawab, 0)) AS '11', sum(IF(idsoal = '81', jawab, 0)) AS '12', sum(IF(idsoal = '82', jawab, 0)) AS '13', sum(IF(idsoal = '83', jawab, 0)) AS '14', sum(IF(idsoal = '84', jawab, 0)) AS '15', sum(IF(idsoal = '85', jawab, 0)) AS '16', sum(IF(idsoal = '86', jawab, 0)) AS '17', sum(IF(idsoal = '87', jawab, 0)) AS '18', sum(IF(idsoal = '88', jawab, 0)) AS '19', sum(IF(idsoal = '89', jawab, 0)) AS '20', sum(IF(idsoal = '90', jawab, 0)) AS '21', sum(IF(idsoal = '91', jawab, 0)) AS '22', sum(IF(idsoal = '92', jawab, 0)) AS '23', sum(IF(idsoal = '93', jawab, 0)) AS '24', sum(IF(idsoal = '94', jawab, 0)) AS '25', sum(IF(idsoal = '95', jawab, 0)) AS '26', sum(IF(idsoal = '96', jawab, 0)) AS '27', sum(IF(idsoal = '97', jawab, 0)) AS '28', sum(IF(idsoal = '98', jawab, 0)) AS '29', sum(IF(idsoal = '99', jawab, 0)) AS '30', sum(IF(idsoal = '100', jawab, 0)) AS '31', sum(IF(idsoal = '101', jawab, 0)) AS '32', sum(IF(idsoal = '102', jawab, 0)) AS '33', sum(IF(idsoal = '103', jawab, 0)) AS '34', sum(IF(idsoal = '104', jawab, 0)) AS '35', sum(IF(idsoal = '105', jawab, 0)) AS '36', sum(IF(idsoal > 69, jawab, 0)) AS Jumlah, sum(IF(idsoal IN ('70','78','83','88','92','96','100'), jawab, 0)) AS jumlahE, sum(IF(idsoal IN ('71','79','84','89','97','103'), jawab, 0)) AS jumlahA, sum(IF(idsoal IN ('72','75','80','85','90','93','98','101','104'), jawab, 0)) AS jumlahC, sum(IF(idsoal IN ('73','76','81','86','94','99','102'), jawab, 0)) AS jumlahN, sum(IF(idsoal IN ('74','77','82','87','91','95','105'), jawab, 0)) AS jumlahO FROM t_answer JOIN cdc_account ON t_answer.iduser = cdc_account.id WHERE t_answer.idacara = 3 GROUP BY cdc_account.id", (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })

                    if(part.length >= 0) {
                        /** send data */
                        res.status(200).json({
                            part, selectpart, getpart 
                        })
                    } else {
                        /** send error */
                        throw new Error("Gagal get skor")
                    }
                } else {
                    /** data part tidak terdaftar */
                    throw new Error("Part atau acara tidak terdaftar")
                }
            } else if(cek_part.length === 0) {
                /** data part tidak terdaftar */
                throw new Error("Part tidak terdaftar")
            } else {
                /** error lainnya */
                throw new Error("Gagal cek data part")
            }
        } catch(e) {
            /** kirim error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** Kirim error */
        res.status(400).json({
            message: "Field tidak boleh kosong"
        })
    }
})

/** Route for hasil assessment kepribadian */
Router.post('/hasilassessmentkepribadian', async (req, res) =>{
    try{
        /** get data mahasiswa */
        const resultcekpeserta = await new Promise((resolve, reject) => {
            Connection.query("SELECT u.id AS id, u.nama AS nama, u.jenis_kelamin AS jenis_kelamin, u.phone AS nomor_kontak, u.tanggal_lahir AS tanggal_lahir, u.tempat_lahir AS tempat_lahir, u.pendidikan AS pendidikan, u.universitas AS universitas, u.fakultas AS fakultas, u.jurusan AS jurusan FROM cdc_account u INNER JOIN t_answer a ON a.iduser = u.id INNER JOIN icare_consult_type c ON c.id = a.idacara WHERE u.id NOT IN (SELECT id_account FROM icare_conc WHERE status = 'aktif' AND id_consult_type = 3) AND u.account_type = 'peserta_event' AND a.idacara = 3 AND u.account_type IN ('peserta','peserta_event') GROUP BY u.id ORDER BY u.nama", (error, results) => {
                if(error){
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })
        if(resultcekpeserta.length > 0){
            /** send data */
            res.status(200).json({
                resultcekpeserta
            })
        } else if(resultcekpeserta.length === 0){
            /** send error */
            throw new Error('Belum ada peserta yang memberikan jawaban');
        } else {
            /** send error */
            throw new Error('Get data peserta error');
        }
    } catch(e) {
        /** send error */
        res.status(400).json({ message: e.message });
    }
})

/** Route for hasil assessment */
Router.post('/hasilassessmentkepribadianpeserta', async (req, res) =>{
    const {selectpeserta} = req.body;

    if(selectpeserta) {
        try{
            /** cek peserta */
            const cekpeserta = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM cdc_account WHERE id = ? AND account_type IN ('peserta','peserta_event') ", [selectpeserta], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cekpeserta.length > 0){
                /** get data assessment part 1 */
                const part1 = await new Promise((resolve, reject) => {
                    Connection.query("SELECT view_total_skor_mhs_acara.konsul, view_total_skor_mhs_acara.namapeserta, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.id_peserta = ? AND view_total_skor_mhs_acara.idpart = '1' AND view_total_skor_mhs_acara.idkonsul = 3 GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectpeserta], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(part1.length >= 0){
                    /** get data assessment part 2 */
                    const part2 = await new Promise((resolve, reject) => {
                        Connection.query("SELECT view_total_skor_mhs_acara.konsul, view_total_skor_mhs_acara.namapeserta, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.id_peserta = ? AND view_total_skor_mhs_acara.idpart = '2' AND view_total_skor_mhs_acara.idkonsul = 3 GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectpeserta], (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(part2.length >= 0){
                        /** get data assessment part 3 */
                        const part3 = await new Promise((resolve, reject) => {
                            Connection.query("SELECT view_total_skor_mhs_acara.konsul, view_total_skor_mhs_acara.namapeserta, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.id_peserta = ? AND view_total_skor_mhs_acara.idpart = '3' AND view_total_skor_mhs_acara.idkonsul = 3 GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectpeserta], (error, results) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve(results)
                                }
                            })
                        })
                        if(part3.length >= 0){
                            /** get data assessment part 4 */
                            const part4 = await new Promise((resolve, reject) => {
                                Connection.query("SELECT view_total_skor_mhs_acara.konsul, view_total_skor_mhs_acara.namapeserta, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.id_peserta = ? AND view_total_skor_mhs_acara.idpart = '4' AND view_total_skor_mhs_acara.idkonsul = 3 GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectpeserta], (error, results) => {
                                    if(error){
                                        reject(error)
                                    } else {
                                        resolve(results)
                                    }
                                })
                            })
                            if(part4.length >= 0){
                                /** get data assessment part 5 */
                                const part5 = await new Promise((resolve, reject) => {
                                    Connection.query("SELECT view_total_skor_mhs_acara.konsul, view_total_skor_mhs_acara.namapeserta, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.id_peserta = ? AND view_total_skor_mhs_acara.idpart = '5' AND view_total_skor_mhs_acara.idkonsul = 3 GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectpeserta], (error, results) => {
                                        if(error){
                                            reject(error)
                                        } else {
                                            resolve(results)
                                        }
                                    })
                                })
                                if(part5.length >= 0){
                                    /** get data peserta yang sudah menjawab */
                                    const resultcekpeserta = await new Promise((resolve, reject) => {
                                        Connection.query("SELECT u.id AS id, u.nama AS nama, u.jenis_kelamin AS jenis_kelamin, u.phone AS nomor_kontak, u.tanggal_lahir AS tanggal_lahir, u.tempat_lahir AS tempat_lahir, u.pendidikan AS pendidikan, u.universitas AS universitas, u.fakultas AS fakultas, u.jurusan AS jurusan FROM cdc_account u INNER JOIN t_answer a ON a.iduser = u.id INNER JOIN icare_consult_type c ON c.id = a.idacara WHERE u.id NOT IN (SELECT id_account FROM icare_conc WHERE status = 'aktif' AND id_consult_type = 3) AND u.account_type = 'peserta_event' AND a.idacara = 3 GROUP BY u.id ORDER BY u.nama", (error, results) => {
                                            if(error){
                                                reject(error)
                                            } else {
                                                resolve(results)
                                            }
                                        })
                                    })
                                    if(resultcekpeserta.length >= 0){
                                        /** get data biodata peserta */
                                        const biodatapeserta = await new Promise((resolve, reject) => {
                                            Connection.query("SELECT m.id AS idpeserta, m.nama AS nama, m.jenis_kelamin AS jenis_kelamin ,m.phone AS nomor_kontak, m.tanggal_lahir AS tanggal_lahir, m.tempat_lahir AS tempat_lahir, m.pendidikan AS pendidikan, m.universitas AS universitas, m.jurusan AS jurusan FROM cdc_account m WHERE m.id = ? AND m.account_type IN ('peserta_event','peserta') ORDER BY m.nama ASC", [selectpeserta],(error, results) => {
                                                if(error){
                                                    reject(error)
                                                } else {
                                                    resolve(results)
                                                }
                                            })
                                        })
                                        if(biodatapeserta.length >= 0){
                                            /** kirim data */
                                            res.status(200).json({
                                                part1, part2, part3, part4, part5,
                                                selectpeserta, resultcekpeserta, biodatapeserta,
                                            })
                                        } else {
                                            /** send error */
                                            throw new Error('Get Biodata Peserta Error'); 
                                        }
                                    } else{
                                        /** send error */
                                        throw new Error('Get Data Peserta Sudah Menjawab Error'); 
                                    }
                                } else {
                                    /** send error */
                                    throw new Error('Get Data Part5 Error'); 
                                }
                            } else {
                                /** send error */
                                throw new Error('Get Data Part4 Error'); 
                            }
                        } else {
                            /** send error */
                            throw new Error('Get Data Part3 Error'); 
                        }
                    } else {
                        /** send error */
                        throw new Error('Get Data Part2 Error');   
                    }
                } else {
                    /** send error */
                    throw new Error('Get Data Part1 Error');    
                }
            } else if(cekpeserta.length === 0){
                /** send error */
                throw new Error('Peserta Tidak Terdaftar');
            } else {
                /** send error */
                throw new Error('Get Data Peserta Error');
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** Kirim error */
        res.status(500).json({
            message: "Field tidak boleh kosong"
        })
    }
})

/** Route for kesimpulan assessment kepribadian */
Router.post('/kesimpulanassessmentkepribadian', async (req, res) =>{
    try{
        /** get data peserta yang sudah diberi kesimpulan */
        const resultcekpeserta = await new Promise((resolve, reject) => {
            Connection.query("SELECT u.id AS id, u.nama AS nama, u.jenis_kelamin AS jenis_kelamin, u.phone AS nomor_kontak, u.tanggal_lahir AS tanggal_lahir, u.tempat_lahir AS tempat_lahir, u.pendidikan AS pendidikan, u.universitas AS universitas, u.fakultas AS fakultas, u.jurusan AS jurusan FROM cdc_account u INNER JOIN t_answer a ON a.iduser = u.id INNER JOIN icare_consult_type c ON c.id = a.idacara WHERE u.id IN (SELECT id_account FROM icare_conc WHERE NOT status = 'hapus' AND id_consult_type = 3) AND a.idacara = 3 AND u.account_type IN ('peserta', 'peserta_event') GROUP BY u.id ORDER BY u.nama", (error, results) => {
                if(error){
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })
        if(resultcekpeserta.length > 0){
            /** send data */
            res.status(200).json({
                resultcekpeserta,
            })
        } else if( resultcekpeserta.length == 0){
            /** Belum ada peserta yang diberi kesimpulan */
            throw new Error('Belum ada peserta yang diberikan kesimpulan');
        } else {
            /** Send error */
            throw new Error('Get data kesimpulan error');
        }
    } catch(e) {
        /** send error */
        res.status(400).json({ message: e.message });
    }
})

/** Route for kesimpulan assessment kepribadian peserta */
Router.post('/kesimpulanassessmentkepribadianpeserta', async (req, res) =>{
    const {selectpeserta} = req.body;

    if(selectpeserta) {
        try{
            const cek_peserta = await new Promise((resolve, reject) => {
                Connection.query(" SELECT id FROM cdc_account WHERE id = ? AND account_type IN ('peserta','peserta_event') ", [selectpeserta], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_peserta.length > 0){
                /** part1 */
                const part1 = await new Promise((resolve, reject) => {
                    Connection.query("SELECT view_total_skor_mhs_acara.konsul, view_total_skor_mhs_acara.namapeserta, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.id_peserta = ? AND view_total_skor_mhs_acara.idpart = '1' AND view_total_skor_mhs_acara.idkonsul = 3 GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectpeserta], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })
                if(part1.length >= 0){
                    /** part2 */
                    const part2 = await new Promise((resolve, reject) => {
                        Connection.query("SELECT view_total_skor_mhs_acara.konsul, view_total_skor_mhs_acara.namapeserta, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.id_peserta = ? AND view_total_skor_mhs_acara.idpart = '2' AND view_total_skor_mhs_acara.idkonsul = 3 GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectpeserta], (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve(results)
                            }
                        })
                    })
                    if(part2.length >= 0){
                        /** part 3 */
                        const part3 = await new Promise((resolve, reject) => {
                            Connection.query("SELECT view_total_skor_mhs_acara.konsul, view_total_skor_mhs_acara.namapeserta, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.id_peserta = ? AND view_total_skor_mhs_acara.idpart = '3' AND view_total_skor_mhs_acara.idkonsul = 3 GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectpeserta], (error, results) => {
                                if(error){
                                    reject(error)
                                } else {
                                    resolve(results)
                                }
                            })
                        })
                        if(part3.length >= 0){
                            /** part 4 */
                            const part4 = await new Promise((resolve, reject) => {
                                Connection.query("SELECT view_total_skor_mhs_acara.konsul, view_total_skor_mhs_acara.namapeserta, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.id_peserta = ? AND view_total_skor_mhs_acara.idpart = '4' AND view_total_skor_mhs_acara.idkonsul = 3 GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectpeserta], (error, results) => {
                                    if(error){
                                        reject(error)
                                    } else {
                                        resolve(results)
                                    }
                                })
                            })
                            if(part4.length >= 0){
                                /** part 5 */
                                const part5 = await new Promise((resolve, reject) => {
                                    Connection.query("SELECT view_total_skor_mhs_acara.konsul, view_total_skor_mhs_acara.namapeserta, view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek, view_total_skor_mhs_acara.skor FROM view_total_skor_mhs_acara WHERE view_total_skor_mhs_acara.id_peserta = ? AND view_total_skor_mhs_acara.idpart = '5' AND view_total_skor_mhs_acara.idkonsul = 3 GROUP BY view_total_skor_mhs_acara.part, view_total_skor_mhs_acara.aspek", [selectpeserta], (error, results) => {
                                        if(error){
                                            reject(error)
                                        } else {
                                            resolve(results)
                                        }
                                    })
                                })
                                if(part5.length >= 0){
                                    /** get result cek peserta */
                                    const resultcekpeserta = await new Promise((resolve, reject) => {
                                        Connection.query("SELECT u.id AS id, u.nama AS nama, u.jenis_kelamin AS jenis_kelamin, u.phone AS nomor_kontak, u.tanggal_lahir AS tanggal_lahir, u.tempat_lahir AS tempat_lahir, u.pendidikan AS pendidikan, u.universitas AS universitas, u.fakultas AS fakultas, u.jurusan AS jurusan FROM cdc_account u INNER JOIN t_answer a ON a.iduser = u.id INNER JOIN icare_consult_type c ON c.id = a.idacara WHERE u.id IN (SELECT id_account FROM icare_conc WHERE NOT status = 'hapus' AND id_consult_type = 3) AND u.account_type = 'peserta_event' AND a.idacara = 3 GROUP BY u.id ORDER BY u.nama", (error, results) => {
                                            if(error){
                                                reject(error)
                                            } else {
                                                resolve(results)
                                            }
                                        })
                                    })
                                    if(resultcekpeserta.length > 0){
                                        /** datapeserta */
                                        const datapeserta = await new Promise((resolve, reject) => {
                                            Connection.query("SELECT u.id AS id, u.nama AS nama, u.jenis_kelamin AS jenis_kelamin, u.phone AS nomor_kontak, u.tanggal_lahir AS tanggal_lahir, u.tempat_lahir AS tempat_lahir, u.pendidikan AS pendidikan, u.universitas AS universitas, u.fakultas AS fakultas, u.jurusan AS jurusan FROM cdc_account u WHERE u.id = ? AND u.account_type = 'peserta_event' ORDER BY u.nama ASC", [selectpeserta], (error, results) => {
                                                if(error){
                                                    reject(error)
                                                } else {
                                                    resolve(results)
                                                }
                                            })
                                        })
                                        if(datapeserta.length >= 0){
                                            /** datakesimpulan */
                                            const datakesimpulan = await new Promise((resolve, reject) => {
                                                Connection.query("SELECT u.id AS idpsikolog, u.nama AS namapsikolog, k.id AS idkesimpulan, k.conc AS kesimpulan FROM icare_conc k INNER JOIN icare_consult_type a ON a.id = k.id_consult_type INNER JOIN cdc_account u ON u.id = k.verified_by WHERE k.id_consult_type = 3 AND k.id_account = ? AND NOT k.status = 'hapus'", [selectpeserta], (error, results) => {
                                                    if(error){
                                                        reject(error)
                                                    } else {
                                                        resolve(results)
                                                    }
                                                })
                                            })
                                            if(datakesimpulan.length >= 0){
                                                /** kirim data */
                                                res.status(200).json({
                                                    part1, part2, part3, part4, part5,
                                                    selectpeserta, resultcekpeserta, datapeserta, datakesimpulan
                                                })
                                            } else {
                                                /** Send error */
                                                throw new Error('Get data kesimpulan error'); 
                                            }
                                        } else {
                                            /** Send error */
                                            throw new Error('Get data peserta error'); 
                                        }
                                    } else if(resultcekpeserta === 0){
                                        /** Send error */
                                        throw new Error('Belum ada peserta yang diberi kesimpulan'); 
                                    } else {
                                        /** Send error */
                                        throw new Error('Get data peserta yang sudah diberi kesimpulan error');     
                                    }
                                } else {
                                    /** Send error */
                                    throw new Error('Get data part 5 error'); 
                                }
                            } else {
                                /** Send error */
                                throw new Error('Get data part 4 error');     
                            }
                        } else {
                            /** Send error */
                            throw new Error('Get data part 3 error'); 
                        }
                    } else {
                        /** Send error */
                        throw new Error('Get data part 2 error'); 
                    }
                } else {
                    /** Send error */
                    throw new Error('Get data part 1 error');    
                }
            } else if(cek_peserta.length === 0){
                /** Send error */
                throw new Error('Peserta tidak terdaftar');
            } else {
                /** Send error */
                throw new Error('Cek peserta error');
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** Kirim error */
        res.status(500).json({
            message: "Field tidak boleh kosong"
        })
    }
})
/** end of sapa konsep */

/** Route for Video Call */
Router.get('/videocall', async (req, res) =>{
    try{
        /** get data video call */
        const listvidcall = await new Promise((resolve, reject) => {
            Connection.query("SELECT r.id AS id, r.nama_room AS namaroom, r.url_room AS urlroom, a.nama AS namapengguna, ac.nama AS namapeserta, r.date_created AS tanggaldibuat, r.time_created AS jamdibuat FROM cdc_account a, icare_roomvidcall r INNER JOIN cdc_account ac ON ac.id = r.idpeserta WHERE status = 'aktif' AND r.idpsikolog = a.id", (error, results) => {
                if(error){
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })

        /** get data psikolog */
        const listpsikolog = await new Promise((resolve, reject) => {
            Connection.query("SELECT u.id, u.nama FROM cdc_account u WHERE account_type IN ('konsultan', 'psikologis') AND NOT id IN (SELECT idpsikolog FROM icare_roomvidcall WHERE status = 'aktif')", (error, results) => {
                if(error){
                    reject(error)
                } else {
                    resolve(results)
                }
            })
        })
        if(listvidcall.length >= 0 && listpsikolog.length >= 0){
            /** send data */
            res.status(200).json({
                listvidcall, listpsikolog
            })
        } else {
            /** Send error */
            throw new Error('Get data list room video call error');
        }
    } catch(e) {
        /** send error */
        res.status(400).json({ message: e.message });
    }
})

/** Route peserta melihat kesimpulan */
Router.post('/ratingpsikolog', async (req, res) =>{
    const { psikolog } = req.body;
    if(psikolog){
        try{
            /** cek psikolog */
            const cek_psikolog = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM cdc_account WHERE id = ? AND account_type IN ('konsultan','psikologis')",[psikolog], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_psikolog.length > 0){
                /** data yang perlu : */
                /** rata2 rating */
                /** count rating perbintang */
                /** rating dan komentar dari setiap peserta pemberi rating dan komentar */

                /** rating dan komentar dari setiap peserta pemberi rating dan komentar */
                const allRating = await new Promise((resolve, reject) => {
                    Connection.query("SELECT r.idpsikolog AS idpsikolog, a.nama AS namapsikolog, r.idpeserta AS idpeserta, ac.nama AS namapeserta, r.rate, r.komentar, r.date_created FROM icare_rating r INNER JOIN cdc_account ac ON ac.id = r.idpeserta INNER JOIN cdc_account a ON a.id = r.idpsikolog WHERE r.status = 'aktif' AND r.id_consult_type = '1' AND r.idpsikolog = ?",[psikolog], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                /** count rating perbintang */
                const countRating = await new Promise((resolve, reject) => {
                    Connection.query("SELECT COUNT(IF(r.rate = 5, 1, NULL)) AS rate5, CONCAT(ROUND((COUNT(IF(r.rate = 5, 1, NULL))/ COUNT(r.rate)*100),2),'%') AS persentase5 ,COUNT(IF(r.rate = 4, 1, NULL)) AS rate4, CONCAT(ROUND((COUNT(IF(r.rate = 4, 1, NULL))/ COUNT(r.rate)*100),2),'%') AS persentase4, COUNT(IF(r.rate = 3, 1, NULL)) AS rate3, CONCAT(ROUND((COUNT(IF(r.rate = 3, 1, NULL))/ COUNT(r.rate)*100),2),'%') AS persentase3, COUNT(IF(r.rate = 2, 1, NULL)) AS rate2, CONCAT(ROUND((COUNT(IF(r.rate = 2, 1, NULL))/ COUNT(r.rate)*100),2),'%') AS persentase2, COUNT(IF(r.rate = 1, 1, NULL)) AS rate1, CONCAT(ROUND((COUNT(IF(r.rate = 1, 1, NULL))/ COUNT(r.rate)*100),2),'%') AS persentase1 FROM icare_rating r WHERE r.idpsikolog = ? AND r.status = 'aktif' AND r.id_consult_type = '1'",[psikolog], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                /** rata2 rating */
                const ratarataRating = await new Promise((resolve, reject) => {
                    Connection.query("SELECT ROUND(AVG(rate),1) AS rata2 FROM icare_rating WHERE status = 'aktif' AND id_consult_type = '1' AND idpsikolog = ?",[psikolog], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve(results)
                        }
                    })
                })

                if(allRating.length >= 0 && countRating.length >= 0 && ratarataRating.length >= 0){
                    /** send data */
                    res.status(200).json({
                        allRating, countRating, ratarataRating
                    })
                } else {
                    /** Send error */
                    throw new Error('Get data rating error');
                }

            } else if(cek_psikolog.length == 0) {
                /** Send error */
                throw new Error('Psikolog tidak terdaftar');
            } else {
                /** Send error */
                throw new Error('Get data psikolog error');
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        res.status(500).json({
            message: "Field tidak boleh kosong"
        })
    }
})

// Router.post('/jawaban', (req, res) => {
//     try{
//         const { selectkonsul, selectuser } = req.body;

//         if(selectkonsul, selectuser){
//             Connection.query("SELECT t.id AS idtipe, q.pertanyaan AS pertanyaan, a.jawaban AS jawaban, ac.nama AS namauser FROM icare_aassessment a INNER JOIN icare_qassessment q ON q.id = a.id_pertanyaan INNER JOIN icare_consult_type t ON q.id_consult_type = t.id INNER JOIN cdc_account ac ON ac.id = a.id_account WHERE t.id = ? AND ac.id = ?", [selectkonsul, selectuser], async (error, results) => {
//                 if(error){
//                     res.status(500).json({
//                         message: 'Get data jawaban error'
//                     })
//                 } else if(results.length >= 0 ){
//                     Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
//                         if(error){
//                             res.status(500).json({
//                                 message: error
//                             })
//                         } else {
//                             Connection.query("SELECT id, nama FROM icare_consult_type WHERE id = ?", [selectkonsul], async (error, pilihkonsul) => {
//                                 if(error){
//                                     res.status(500).json({
//                                         message: error
//                                     })
//                                 } else {
//                                     Connection.query("SELECT q.id AS idp, q.pertanyaan AS pertanyaan FROM icare_qassessment q WHERE q.id_consult_type = ? AND q.status = 'aktif' ", [selectkonsul], async (error, pertanyaan) => {
//                                         if(error){
//                                             throw error;
//                                         } else {
//                                             /** Kirim data konsul */
//                                             res.status(200).json({
//                                                 results: results,
//                                                 konsul : konsul,
//                                                 pilihkonsul: pilihkonsul,
//                                                 pertanyaan: pertanyaan,
//                                                 selectkonsul
//                                             })
//                                         }
//                                     })
//                                 }
//                             })
//                         }
//                     })
//                 }
//             })
//         } else {
//             /** Field kosong */
//             res.status(500).json({
//                 message: "Field tidak boleh kosong"
//             });
//         }
//     } catch(error){
//         console.log(error);
//     }
// });

// Router.post('/listjawaban', (req, res) => {
//     try{
//         const { selectkonsul } = req.body;

//         if(selectkonsul){
//             Connection.query("SELECT t.id AS idtipe, q.pertanyaan AS pertanyaan, a.jawaban AS jawaban, ac.nama AS namauser FROM icare_aassessment a INNER JOIN icare_qassessment q ON q.id = a.id_pertanyaan INNER JOIN icare_consult_type t ON q.id_consult_type = t.id INNER JOIN cdc_account ac ON ac.id = a.id_account WHERE t.id = ?", [selectkonsul], async (error, results) => {
//                 if(error){
//                     res.status(500).json({
//                         message: 'Get data jawaban error'
//                     })
//                 } else if(results.length >= 0 ){
//                     Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
//                         if(error){
//                             res.status(500).json({
//                                 message: error
//                             })
//                         } else {
//                             Connection.query("SELECT id, nama FROM icare_consult_type WHERE id = ?", [selectkonsul], async (error, pilihkonsul) => {
//                                 if(error){
//                                     res.status(500).json({
//                                         message: error
//                                     })
//                                 } else {
//                                     Connection.query("SELECT q.id AS idp, q.pertanyaan AS pertanyaan FROM icare_qassessment q WHERE q.id_consult_type = ? AND q.status = 'aktif' ", [selectkonsul], async (error, pertanyaan) => {
//                                         if(error){
//                                             throw error;
//                                         } else {
//                                             /** Kirim data konsul */
//                                             res.status(200).json({
//                                                 results: results,
//                                                 konsul : konsul,
//                                                 pilihkonsul: pilihkonsul,
//                                                 pertanyaan: pertanyaan,
//                                                 selectkonsul
//                                             })
//                                         }
//                                     })
//                                 }
//                             })
//                         }
//                     })
//                 }
//             })
//         } else {
//             /** Field kosong */
//             res.status(500).json({
//                 message: "Field tidak boleh kosong"
//             });
//         }
//     } catch(error){
//         console.log(error);
//     }
// });

/** Route for lupa password */
Router.post('/lupapassword', (req, res) =>{
    try{
        const {email} = req.body;

        if(email) {
            Connection.query("SELECT email AS email, id AS id from cdc_account WHERE email = ?", [email], async(error, results) => {
                if(error){
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(results.length == 0){
                    /** email tidak terdaftar */
                    res.status(403).json({
                        message: "Jika email terdaftar, silahkan cek email anda dan ikuti instruksinya"
                    })
                } else if(results.length > 0){
                    /** email terdaftar */
                    res.status(200).json({
                        results
                    })
                } else {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                }
            })
        } else {
            /** field kosong */
            res.status(403).json({
                message: 'Email tidak boleh kosong'
            })
        }
    } catch(error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

/** Route for logout */
Router.post('/logout', async (req, res) =>{
    const { idu, namabrowser, namaos, namaplatform } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    var ipadd = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).substr(7)

    if(idu) {
        try{
            const cek_user = await new Promise((resolve, reject) => {
                Connection.query("SELECT * FROM cdc_account WHERE id = ?", [idu], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_user.length > 0){
                const save_activity = await new Promise((resolve, reject) => {
                    Connection.query("INSERT INTO icare_log SET ?", [{id: null, id_account: cek_user[0].id, email_account: cek_user[0].email, aktifitas: 'logout', ip_address: ipadd, nama_browser: namabrowser, nama_os: namaos, nama_platform: namaplatform, date_created: tanggal, time_created: waktu}], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve("true")
                        }
                    })
                })
                if(save_activity === "true"){
                    res.status(200).json({
                        message: 'Logout Berhasil'
                    });
                } else {
                    /** send error */
                    throw new Error('Logout Gagal');
                }
            } else {
                /** send error */
                throw new Error('Logout Gagal');
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** field kosong */
        res.status(403).json({
            message: 'Email tidak boleh kosong'
        })
    }
})

/** Route For Log Activity */
Router.post('/logactivity', async (req, res) =>{
    const { datestart, dateend } = req.body;
    if(datestart && dateend){
        try{
            /** get data log */
            const data_log = await new Promise((resolve, reject) => {
                Connection.query("SELECT * FROM icare_log WHERE date_created BETWEEN ? AND ?", [datestart, dateend], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })

            /** hit count */
            const data_count = await new Promise((resolve, reject) => {
                Connection.query("SELECT COUNT(id) AS count FROM icare_log WHERE aktifitas = 'login' AND date_created BETWEEN ? AND ? ", [datestart, dateend], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(data_log.length >= 0){
                res.status(200).json({
                    data_log, data_count, datestart, dateend
                });
            } else {
                /** send error */
                throw new Error('Get Data Log Activity Gagal');
            }
        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** field kosong */
        res.status(403).json({
            message: 'Field tidak boleh kosong'
        })
    }
})



module.exports = Router;