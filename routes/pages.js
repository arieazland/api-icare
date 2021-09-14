const Express = require("express");
const Router = Express.Router();
const Dotenv = require("dotenv");
// Set Moment Format engine
const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");
const { Cookie } = require("express-session");

/** Route for Register */
Router.get('/', (req, res) => {
    res.send("Hello, welcome to API-ICare Page")
})

Router.get('/userlist', (req, res) =>{
    Connection.query("SELECT * FROM icare_account WHERE NOT account_type = 'nonaktif'  ORDER BY nama ASC", async (error, results) =>{
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

Router.post("/getpeserta", (req, res) => {
    try{

        const { idpeserta } = req.body

        if(idpeserta){
            Connection.query("SELECT id, email, nama, phone FROM icare_account WHERE id = ? AND account_type IN ('peserta','peserta_event')", [idpeserta], async (error, cekpeserta) => {
                if(error) {
                    /** Kirim error */
                    res.status(500).json({
                        message: error
                    })
                } else if(cekpeserta.length == 0) {
                    /** data peserta tidak ada */
                    res.status(403).json({
                        message: "Peserta tidak terdaftar"
                    })
                } else if(cekpeserta.length > 0) {
                    /** get data peserta */
                    res.status(200).json({
                        data: cekpeserta
                    })
                } else {
                    /** Kirim error */
                    res.status(500).json({
                        message: "Error, please contact developer"
                    })
                }
            })
        } else {
            /** field kosong */
            res.status(403).json({
                message: "Field tidak boleh kosong"
            })
        }
    } catch (error) {
        /** Kirim error */
        res.status(500).json({
            message: error
        })
    }
})

Router.get('/konsullist', (req, res) => {
    Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, results) => {
        if(error){
            res.status(500).json({
                message: 'Get data konsul error'
            })
        } else if(results.length >= 0){
            /** Kirim data konsul */
            res.status(200).json({
                data: results
            })
        }
    })
})

Router.post('/konsulid', (req, res) => {
    try{
        // var id = req.params.id;
        const { id } = req.body;
        if(id){
            Connection.query('SELECT * FROM icare_consult_type WHERE id = ?', [id], async (error, results) => {
                if(error){
                    res.status(500).json({
                        message: 'Get data konsul error'
                    })
                } else if(results.length >= 0 ){
                    /** Kirim data konsul */
                    res.status(200).json({
                        data: results
                    })
                }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch (error) {
        console.log(error);
    }
})

Router.post('/partisipant', (req, res) => {
    try{
        // var id = req.params.id;
        const { selectkonsul } = req.body;
        if(selectkonsul){
            Connection.query('SELECT a.id AS idca, u.id AS iduser, u.nama AS namauser FROM icare_consult_acc a INNER JOIN icare_consult_type t ON a.id_tipe_konsultasi = t.id INNER JOIN icare_account u ON a.id_account = u.id WHERE t.id = ?', [selectkonsul], async (error, results) => {
                if(error){
                    res.status(500).json({
                        message: 'Get data partisipant error'
                    })
                } else if(results.length >= 0 ){
                    Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
                        if(error){
                            res.status(500).json({
                                message: error
                            })
                        } else {
                            Connection.query('SELECT id, nama FROM icare_consult_type WHERE id = ?', [selectkonsul], async (error, pilihkonsul) => {
                                if(error){
                                    res.status(500).json({
                                        message: error
                                    })
                                } else {
                                    Connection.query('SELECT u.id, u.nama FROM icare_account u WHERE account_type = ? AND u.id NOT IN (SELECT a.id_account FROM icare_consult_acc a WHERE a.id_tipe_konsultasi = ?)', ['psikologis', selectkonsul], async (error, psikolog) => {
                                        if(error){
                                            res.status(500).json({
                                                message: error
                                            })
                                        } else {
                                            /** Kirim data konsul */
                                            res.status(200).json({
                                                results: results,
                                                konsul : konsul,
                                                pilihkonsul: pilihkonsul,
                                                psikolog : psikolog,
                                                selectkonsul
                                            })
                                        }
                                    } )
                                }
                            })
                        }
                    })
                }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch (error) {
        console.log(error);
    }
})

Router.post('/listsoal', (req, res) => {
    try{
        // var id = req.params.id;
        const { selectkonsul } = req.body;
        if(selectkonsul){
            Connection.query('SELECT q.id AS idp, q.pertanyaan AS pertanyaan FROM icare_qassessment q INNER JOIN icare_consult_type t ON t.id = q.id_consult_type WHERE t.id = ? AND NOT q.status = "hapus" ', [selectkonsul], async (error, results) => {
                if(error){
                    res.status(500).json({
                        message: 'Get data partisipant error'
                    })
                } else if(results.length >= 0 ){
                    Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
                        if(error){
                            res.status(500).json({
                                message: error
                            })
                        } else {
                            Connection.query('SELECT id, nama FROM icare_consult_type WHERE id = ?', [selectkonsul], async (error, pilihkonsul) => {
                                if(error){
                                    res.status(500).json({
                                        message: error
                                    })
                                } else {
                                    /** Kirim data konsul */
                                    res.status(200).json({
                                        results: results,
                                        konsul : konsul,
                                        pilihkonsul: pilihkonsul,
                                        selectkonsul
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch (error) {
        console.log(error);
    }
})

Router.post('/listpart', (req, res) => {
    try {
        const { selectkonsul, selectuser } = req.body;

        if(selectkonsul, selectuser){
            /** cek tipe konsultasi */
            Connection.query("SELECT * FROM icare_consult_type WHERE id = ? AND NOT status_consult = 'hapus'", [selectkonsul], async (error, pilihkonsul) =>{ 
                if(error){
                    res.status(500).json({
                        message: error
                    })
                } else if(pilihkonsul.length == 0) {
                    res.status(403).json({
                        message: 'Tipe konsul tidak terdaftar'
                    })
                } else if(pilihkonsul.length > 0){
                    /** cek data peserta */
                    Connection.query("SELECT * FROM icare_account WHERE id = ? AND (account_type = 'peserta_event' OR account_type = 'peserta_event') AND NOT account_type = 'nonaktif'", [selectuser], async (error, cekuser) => {
                        if(error){
                            res.status(500).json({
                                message: error
                            }) 
                        } else if(cekuser.length == 0) {
                            res.status(403).json({
                                message: 'Peserta tidak terdaftar'
                            })
                        } else if(cekuser.length > 0) {
                            /** cek apakah tipe konsultasi adalah konsultasi berlanjut atau tidak */
                            Connection.query("SELECT repeat_consult FROM icare_consult_type WHERE id = ? AND repeat_consult = 'y'", [selectkonsul], async(error, cekrepeat) => {
                                if(error){
                                    res.status(500).json({
                                        message: error
                                    }) 
                                }
                                else if(cekrepeat.length == 0){
                                    /** tipe konsultasi 1x konsul */
                                    Connection.query("SELECT * FROM icare_a2assessment WHERE id_account = ? AND id_consult_type = ?", [selectuser, selectkonsul], async (error, cekjawaban) => {
                                        if(error){
                                            res.status(500).json({
                                                message: error
                                            }) 
                                        }
                                        else if(cekjawaban.length == 0) {
                                            /** peserta blm memberikan jawaban */
                                            /** get data part */
                                            Connection.query("SELECT * FROM icare_passessment WHERE id_consult_type = ?", [selectkonsul], async(error, datapart) => {
                                                if(error){
                                                    res.status(500).json({
                                                        message: error
                                                    }) 
                                                } else if(datapart.length >= 0){
                                                    /** get data konsul */
                                                    Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
                                                        if(error){
                                                            res.status(500).json({
                                                                message: error
                                                            }) 
                                                        } else if(konsul.length >= 0){
                                                            /** Kirim data part */
                                                            res.status(200).json({
                                                                datapart: datapart,
                                                                konsul : konsul,
                                                                pilihkonsul: pilihkonsul,
                                                                selectkonsul
                                                            })
                                                        } else {
                                                            res.status(500).json({
                                                                message: 'Get data konsul error'
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    res.status(500).json({
                                                        message: 'Get data part error'
                                                    })
                                                }
                                            })
                                        }
                                        else if(cekjawaban.length > 0) {
                                            /** peserta sudah memberikan jawaban */
                                            res.status(500).json({
                                                message: 'Anda Sudah Menyelesaikan Assessment Ini, terima kasih atas partisipasinya'
                                            })
                                        }
                                    })
                                } else if(cekrepeat.length > 0){
                                    /** tipe konsultasi berulang */
                                    /** get data part */
                                    Connection.query("SELECT * FROM icare_passessment WHERE id_consult_type = ?", [selectkonsul], async(error, datapart) => {
                                        if(error){
                                            res.status(500).json({
                                                message: error
                                            }) 
                                        } else if(datapart.length >= 0){
                                            /** get data konsul */
                                            Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
                                                if(error){
                                                    res.status(500).json({
                                                        message: error
                                                    }) 
                                                } else if(konsul.length >= 0){
                                                    /** Kirim data part */
                                                    res.status(200).json({
                                                        datapart: datapart,
                                                        konsul : konsul,
                                                        pilihkonsul: pilihkonsul,
                                                        selectkonsul
                                                    })
                                                } else {
                                                    res.status(500).json({
                                                        message: 'Get data konsul error'
                                                    })
                                                }
                                            })
                                        } else {
                                            res.status(500).json({
                                                message: 'Get data part error'
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            res.status(500).json({
                                message: 'Get data peserta error'
                            })
                        }
                    })
                } else {
                    res.status(500).json({
                        message: 'Get data konsul error'
                    })
                }
            })
        }
    }catch (error) {
        console.log(error);
    }
})

/** start of sapa konsep */
/** list pertanyaan SAPA */
Router.post('/listpertanyaan2', async (req, res) =>{
    const { selectkonsul, idu } = req.body;
    if(selectkonsul, idu){
        try{
            /** cek apakah user sudah ada jawaban di part 1 */
            const cek_part1 = await new Promise((resolve, reject) => {
                Connection.query('select icare_account.nama, t_part.id, t_part.nama from t_answer, t_part, t_soal, icare_account where icare_account.id = ? AND t_part.id = 1 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND icare_account.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectkonsul] , (error, cek_jawaban1) => {
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
                    /** jika tidak error, get data acara */
                    const datakonsul = await new Promise((resolve, reject) => {
                        Connection.query("SELECT * FROM icare_consult_type WHERE status_consult = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                            if(error) { 
                                /** jika error */
                                reject(error);
                            } else {
                                /** jika results */
                                resolve(results);
                            }
                        })
                    })
                    if(datakonsul.length >= 0){
                        /** kirim data */
                        res.status(201).json({ pertanyaan_part1, selectkonsul, datakonsul, partpertanyaan : "1" });
                    } else {
                        /** jika error lainnya */
                        throw new Error('Error, please contact developer');
                    }
                } else {
                    /** jika error lainnya */
                    throw new Error('Error, please contact developer');
                }
            } else if(cek_part1.length > 0){
                /** jika user sudah menjawab part 1 pada acara terpilih, cek jawaban di part 2 */
                const cek_part2 = await new Promise((resolve, reject) => {
                    Connection.query('select icare_account.nama, t_part.id, t_part.nama from t_answer, t_part, t_soal, icare_account where icare_account.id = ? AND t_part.id = 2 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND icare_account.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id', [idu, selectkonsul] , (error, cek_jawaban2) => {
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
                        /** jika tidak error, get data acara */
                        const datakonsul = await new Promise((resolve, reject) => {
                            Connection.query("SELECT * FROM icare_consult_type WHERE status_consult = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                                if(error) { 
                                    /** jika error */
                                    reject(error);
                                } else {
                                    /** jika results */
                                    resolve(results);
                                }
                            })
                        })
                        if(datakonsul.length >= 0){
                            /** kirim data */
                            res.status(201).json({ pertanyaan_part2, selectkonsul, datakonsul, partpertanyaan : "2" });
                        } else {
                            /** jika error lainnya */
                            throw new Error('Error, please contact developer');
                        }
                    } else {
                        /** jika error lainnya */
                        throw new Error('Error, please contact developer');
                    }
                } else if(cek_part2.length > 0){
                    /** jika user sudah menjawab part 2 pada acara terpilih, cek jawaban di part 3 */
                    const cek_part3 = await new Promise((resolve, reject) => {
                        Connection.query('select icare_account.nama, t_part.id, t_part.nama from t_answer, t_part, t_soal, icare_account where icare_account.id = ? AND t_part.id = 3 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND icare_account.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectkonsul] , (error, cek_jawaban3) => {
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
                            /** jika tidak error, get data acara */
                            const datakonsul = await new Promise((resolve, reject) => {
                                Connection.query("SELECT * FROM icare_consult_type WHERE status_consult = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                                    if(error) { 
                                        /** jika error */
                                        reject(error);
                                    } else {
                                        /** jika results */
                                        resolve(results);
                                    }
                                })
                            })
                            if(datakonsul.length >= 0){
                                /** kirim data */
                                res.status(201).json({ pertanyaan_part3, selectkonsul, datakonsul, partpertanyaan : "3" });
                            } else {
                                /** jika error lainnya */
                                throw new Error('Error, please contact developer');
                            }
                        } else {
                            /** jika error lainnya */
                            throw new Error('Error, please contact developer');
                        }
                    } else if(cek_part3.length > 0){
                        /** jika user sudah menjawab part 3 pada acara terpilih, cek jawaban di part 4 */
                        const cek_part4 = await new Promise((resolve, reject) => {
                            Connection.query('select icare_account.nama, t_part.id, t_part.nama from t_answer, t_part, t_soal, icare_account where icare_account.id = ? AND t_part.id = 4 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND icare_account.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectkonsul] , (error, cek_jawaban4) => {
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
                                /** jika tidak error, get data acara */
                                const datakonsul = await new Promise((resolve, reject) => {
                                    Connection.query("SELECT * FROM icare_consult_type WHERE status_consult = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                                        if(error) { 
                                            /** jika error */
                                            reject(error);
                                        } else {
                                            /** jika results */
                                            resolve(results);
                                        }
                                    })
                                })
                                if(datakonsul.length >= 0){
                                    /** kirim data */
                                    res.status(201).json({ pertanyaan_part4, selectkonsul, datakonsul, partpertanyaan : "4" });
                                } else {
                                    /** jika error lainnya */
                                    throw new Error('Error, please contact developer');
                                }
                            } else {
                                /** jika error lainnya */
                                throw new Error('Error, please contact developer');
                            }
                        } else if(cek_part4.length > 0) {
                            /** jika user sudah menjawab part 4 pada acara terpilih, cek jawaban di part 5 */
                            const cek_part5 = await new Promise((resolve, reject) => {
                                Connection.query('select icare_account.nama, t_part.id, t_part.nama from t_answer, t_part, t_soal, icare_account where icare_account.id = ? AND t_part.id = 5 AND t_answer.idsoal = t_soal.id AND t_soal.idpart = t_part.id AND icare_account.id = t_answer.iduser AND t_answer.idacara = ? GROUP BY t_part.id ', [idu, selectkonsul] , (error, cek_jawaban5) => {
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
                                    /** jika tidak error, get data acara */
                                    const datakonsul = await new Promise((resolve, reject) => {
                                        Connection.query("SELECT * FROM icare_consult_type WHERE status_consult = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                                            if(error) { 
                                                /** jika error */
                                                reject(error);
                                            } else {
                                                /** jika results */
                                                resolve(results);
                                            }
                                        })
                                    })
                                    if(datakonsul.length >= 0){
                                        /** kirim data */
                                        res.status(201).json({ pertanyaan_part5, selectkonsul, datakonsul, partpertanyaan : "5" });
                                    } else {
                                        /** jika error lainnya */
                                        throw new Error('Error, please contact developer');
                                    }
                                } else {
                                    /** jika error lainnya */
                                    throw new Error('Error, please contact developer');
                                }
                            } else if(cek_part5.length > 0) {
                                /** jika user sudah menjawab part 5 pada acara terpilih, kirim notif test selesai */
                                const datakonsul = await new Promise((resolve, reject) => {
                                    Connection.query("SELECT * FROM icare_consult_type WHERE status_consult = 'aktif' AND CURDATE() BETWEEN start AND end ORDER BY id ASC", async (error, results) => {
                                        if(error) { 
                                            /** jika error */
                                            reject(error);
                                        } else {
                                            /** jika results */
                                            resolve(results);
                                        }
                                    })
                                })
                                if(datakonsul.length >= 0){
                                    /** kirim data */
                                    res.status(201).json({ message: 'Assessment selesai, silahkan logout. Terima kasih', selectkonsul, datakonsul });
                                } else {
                                    /** jika error lainnya */
                                    throw new Error('Error, please contact developer');
                                }
                            } else {
                                /** jika error lainnya */
                                throw new Error('Error, please contact developer');
                            }

                        } else {
                            /** jika error lainnya */
                            throw new Error('Error, please contact developer');
                        }
                    } else {
                        /** jika error lainnya */
                        throw new Error('Error, please contact developer');
                    }
                } else {
                    /** jika error lainnya */
                    throw new Error('Error, please contact developer');
                }

            } else {
                /** jika error lainnya */
                throw new Error('Error, please contact developer');
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
                        Connection.query("SELECT nama, sum(IF(idsoal = '1', jawab, 0)) AS '1', sum(IF(idsoal = '2', jawab, 0)) AS '2', sum(IF(idsoal = '3', jawab, 0)) AS '3', sum(IF(idsoal = '4', jawab, 0)) AS '4', sum(IF(idsoal = '5', jawab, 0)) AS '5', sum(IF(idsoal = '6', jawab, 0)) AS '6', sum(IF(idsoal = '7', jawab, 0)) AS '7', sum(IF(idsoal = '8', jawab, 0)) AS '8', sum(IF(idsoal = '9', jawab, 0)) AS '9', sum(IF(idsoal = '10', jawab, 0)) AS '10', sum(IF(idsoal = '11', jawab, 0)) AS '11', sum(IF(idsoal = '12', jawab, 0)) AS '12', sum(IF(idsoal = '13', jawab, 0)) AS '13', sum(IF(idsoal = '14', jawab, 0)) AS '14', sum(IF(idsoal = '15', jawab, 0)) AS '15', sum(IF(idsoal < 16, jawab, 0)) AS Jumlah FROM t_answer JOIN icare_account ON t_answer.iduser = icare_account.id WHERE t_answer.idacara = 3 GROUP BY icare_account.id", (error, results) => {
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
                        Connection.query("SELECT nama, sum(IF(idsoal = '16', jawab, 0)) AS '1', sum(IF(idsoal = '17', jawab, 0)) AS '2', sum(IF(idsoal = '18', jawab, 0)) AS '3', sum(IF(idsoal = '19', jawab, 0)) AS '4', sum(IF(idsoal = '20', jawab, 0)) AS '5', sum(IF(idsoal = '21', jawab, 0)) AS '6', sum(IF(idsoal = '22', jawab, 0)) AS '7', sum(IF(idsoal = '23', jawab, 0)) AS '8', sum(IF(idsoal = '24', jawab, 0)) AS '9', sum(IF(idsoal = '25', jawab, 0)) AS '10', sum(IF(idsoal = '26', jawab, 0)) AS '11', sum(IF(idsoal = '27', jawab, 0)) AS '12', sum(IF(idsoal = '28', jawab, 0)) AS '13', sum(IF(idsoal = '29', jawab, 0)) AS '14', sum(IF(idsoal = '30', jawab, 0)) AS '15', sum(IF(idsoal = '31', jawab, 0)) AS '16', sum(IF(idsoal = '32', jawab, 0)) AS '17', sum(IF(idsoal = '33', jawab, 0)) AS '18', sum(IF(idsoal = '34', jawab, 0)) AS '19', sum(IF(idsoal = '35', jawab, 0)) AS '20', sum(IF(idsoal < 36 AND idsoal > 15, jawab, 0)) AS Jumlah FROM t_answer JOIN icare_account ON t_answer.iduser = icare_account.id WHERE t_answer.idacara = 3 GROUP BY icare_account.id", (error, results) => {
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
                        Connection.query("SELECT nama, sum(IF(idsoal = '36', jawab, 0)) AS '1', sum(IF(idsoal = '37', jawab, 0)) AS '2', sum(IF(idsoal = '38', jawab, 0)) AS '3', sum(IF(idsoal = '39', jawab, 0)) AS '4', sum(IF(idsoal = '40', jawab, 0)) AS '5', sum(IF(idsoal = '41', jawab, 0)) AS '6', sum(IF(idsoal = '42', jawab, 0)) AS '7', sum(IF(idsoal = '43', jawab, 0)) AS '8', sum(IF(idsoal = '44', jawab, 0)) AS '9', sum(IF(idsoal = '45', jawab, 0)) AS '10', sum(IF(idsoal = '46', jawab, 0)) AS '11', sum(IF(idsoal = '47', jawab, 0)) AS '12', sum(IF(idsoal = '48', jawab, 0)) AS '13', sum(IF(idsoal = '49', jawab, 0)) AS '14', sum(IF(idsoal > 35 AND idsoal < 50, jawab, 0)) AS Jumlah FROM t_answer JOIN icare_account ON t_answer.iduser = icare_account.id WHERE t_answer.idacara = 3 GROUP BY icare_account.id", (error, results) => {
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
                        Connection.query("SELECT nama, sum(IF(idsoal = '50', jawab, 0)) AS '1', sum(IF(idsoal = '51', jawab, 0)) AS '2', sum(IF(idsoal = '52', jawab, 0)) AS '3', sum(IF(idsoal = '53', jawab, 0)) AS '4', sum(IF(idsoal = '54', jawab, 0)) AS '5', sum(IF(idsoal = '55', jawab, 0)) AS '6', sum(IF(idsoal = '56', jawab, 0)) AS '7', sum(IF(idsoal = '57', jawab, 0)) AS '8', sum(IF(idsoal = '58', jawab, 0)) AS '9', sum(IF(idsoal = '59', jawab, 0)) AS '10', sum(IF(idsoal = '60', jawab, 0)) AS '11', sum(IF(idsoal = '61', jawab, 0)) AS '12', sum(IF(idsoal = '62', jawab, 0)) AS '13', sum(IF(idsoal = '63', jawab, 0)) AS '14', sum(IF(idsoal = '64', jawab, 0)) AS '15', sum(IF(idsoal = '65', jawab, 0)) AS '16', sum(IF(idsoal = '66', jawab, 0)) AS '17', sum(IF(idsoal = '67', jawab, 0)) AS '18', sum(IF(idsoal = '68', jawab, 0)) AS '19', sum(IF(idsoal = '69', jawab, 0)) AS '20', sum(IF(idsoal < 70 AND idsoal > 49, jawab, 0)) AS Jumlah FROM t_answer JOIN icare_account ON t_answer.iduser = icare_account.id WHERE t_answer.idacara = 3 GROUP BY icare_account.id", (error, results) => {
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
                        Connection.query("SELECT nama, sum(IF(idsoal = '70', jawab, 0)) AS '1', sum(IF(idsoal = '71', jawab, 0)) AS '2', sum(IF(idsoal = '72', jawab, 0)) AS '3', sum(IF(idsoal = '73', jawab, 0)) AS '4', sum(IF(idsoal = '74', jawab, 0)) AS '5', sum(IF(idsoal = '75', jawab, 0)) AS '6', sum(IF(idsoal = '76', jawab, 0)) AS '7', sum(IF(idsoal = '77', jawab, 0)) AS '8', sum(IF(idsoal = '78', jawab, 0)) AS '9', sum(IF(idsoal = '79', jawab, 0)) AS '10', sum(IF(idsoal = '80', jawab, 0)) AS '11', sum(IF(idsoal = '81', jawab, 0)) AS '12', sum(IF(idsoal = '82', jawab, 0)) AS '13', sum(IF(idsoal = '83', jawab, 0)) AS '14', sum(IF(idsoal = '84', jawab, 0)) AS '15', sum(IF(idsoal = '85', jawab, 0)) AS '16', sum(IF(idsoal = '86', jawab, 0)) AS '17', sum(IF(idsoal = '87', jawab, 0)) AS '18', sum(IF(idsoal = '88', jawab, 0)) AS '19', sum(IF(idsoal = '89', jawab, 0)) AS '20', sum(IF(idsoal = '90', jawab, 0)) AS '21', sum(IF(idsoal = '91', jawab, 0)) AS '22', sum(IF(idsoal = '92', jawab, 0)) AS '23', sum(IF(idsoal = '93', jawab, 0)) AS '24', sum(IF(idsoal = '94', jawab, 0)) AS '25', sum(IF(idsoal = '95', jawab, 0)) AS '26', sum(IF(idsoal = '96', jawab, 0)) AS '27', sum(IF(idsoal = '97', jawab, 0)) AS '28', sum(IF(idsoal = '98', jawab, 0)) AS '29', sum(IF(idsoal = '99', jawab, 0)) AS '30', sum(IF(idsoal = '100', jawab, 0)) AS '31', sum(IF(idsoal = '101', jawab, 0)) AS '32', sum(IF(idsoal = '102', jawab, 0)) AS '33', sum(IF(idsoal = '103', jawab, 0)) AS '34', sum(IF(idsoal = '104', jawab, 0)) AS '35', sum(IF(idsoal = '105', jawab, 0)) AS '36', sum(IF(idsoal > 69, jawab, 0)) AS Jumlah FROM t_answer JOIN icare_account ON t_answer.iduser = icare_account.id WHERE t_answer.idacara = 3 GROUP BY icare_account.id", (error, results) => {
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
/** end of sapa konsep */

Router.post('/listsoal2', (req, res) => {
    try{
        const { selectkonsul, selectpart } = req.body;

        if(selectkonsul, selectpart){
            Connection.query("SELECT * FROM icare_consult_type WHERE status_consult = 'aktif' AND id = ?", selectkonsul, async(error, pilihkonsul) => {
                if(error){
                    res.status(500).json({
                        message: 'Get data jawaban error'
                    })
                } else if(pilihkonsul.length == 0){
                    res.status(403).json({
                        message: 'Konsul tidak terdaftar'
                    })
                } else if(pilihkonsul.length > 0){
                    Connection.query("SELECT * FROM icare_passessment WHERE status = 'aktif' AND id = ?", selectpart, async(error, cekpart) => {
                        if(error){
                            res.status(500).json({
                                message: 'Get data kualifikasi konsultasi error'
                            })
                        } else if(cekpart.length == 0){
                            res.status(403).json({
                                message: 'Kualifikasi konsultasi tidak terdaftar'
                            })
                        } else if(cekpart.length > 0){
                            Connection.query("SELECT * FROM icare_q3assessment WHERE status = 'aktif' AND idpart = ?", selectpart, async(error, soal) => {
                                if(error){
                                    res.status(500).json({
                                        message: 'Get data soal error'
                                    })
                                } else if(soal.length > 0){
                                    /** get all data part */
                                    Connection.query("SELECT * FROM icare_passessment WHERE status = 'aktif' AND id_consult_type = ?", [selectkonsul], async(error, datapart) => {
                                        if(error){
                                            res.status(500).json({
                                                message: error
                                            }) 
                                        } else if(datapart.length >= 0){
                                            /** get data konsul */
                                            Connection.query("SELECT * FROM icare_consult_type WHERE status_consult = 'aktif' ORDER BY nama ASC", async (error, konsul) => {
                                                if(error){
                                                    res.status(500).json({
                                                        message: error
                                                    }) 
                                                } else if(konsul.length >= 0){
                                                    /** Kirim data soal */
                                                    res.status(200).json({
                                                        datapart: datapart,
                                                        konsul : konsul,
                                                        pilihkonsul: pilihkonsul,
                                                        soal: soal,
                                                        selectkonsul,
                                                        selectpart
                                                    })
                                                } else {
                                                    res.status(500).json({
                                                        message: 'Get data konsul error'
                                                    })
                                                }
                                            })
                                        } else {
                                            res.status(500).json({
                                                message: 'Get data part error'
                                            })
                                        }
                                    })
                                } else if(soal.length == 0){
                                    res.status(403).json({
                                        message: 'Belum ada soal terdaftar'
                                    })
                                } else {
                                    res.status(500).json({
                                        message: 'Get data soal error'
                                    })
                                }
                            })
                        } else {
                            res.status(500).json({
                                message: 'Get data kualifikasi konsultasi error'
                            })
                        }
                    })
                } else {
                    res.status(500).json({
                        message: 'Get data konsul error'
                    })
                }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch(error) {
        console.log(error);
    }
})

Router.post('/jawaban', (req, res) => {
    try{
        const { selectkonsul, selectuser } = req.body;

        if(selectkonsul, selectuser){
            Connection.query("SELECT t.id AS idtipe, q.pertanyaan AS pertanyaan, a.jawaban AS jawaban, ac.nama AS namauser FROM icare_aassessment a INNER JOIN icare_qassessment q ON q.id = a.id_pertanyaan INNER JOIN icare_consult_type t ON q.id_consult_type = t.id INNER JOIN icare_account ac ON ac.id = a.id_account WHERE t.id = ? AND ac.id = ?", [selectkonsul, selectuser], async (error, results) => {
                if(error){
                    res.status(500).json({
                        message: 'Get data jawaban error'
                    })
                } else if(results.length >= 0 ){
                    Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
                        if(error){
                            res.status(500).json({
                                message: error
                            })
                        } else {
                            Connection.query("SELECT id, nama FROM icare_consult_type WHERE id = ?", [selectkonsul], async (error, pilihkonsul) => {
                                if(error){
                                    res.status(500).json({
                                        message: error
                                    })
                                } else {
                                    Connection.query("SELECT q.id AS idp, q.pertanyaan AS pertanyaan FROM icare_qassessment q WHERE q.id_consult_type = ? AND q.status = 'aktif' ", [selectkonsul], async (error, pertanyaan) => {
                                        if(error){
                                            throw error;
                                        } else {
                                            /** Kirim data konsul */
                                            res.status(200).json({
                                                results: results,
                                                konsul : konsul,
                                                pilihkonsul: pilihkonsul,
                                                pertanyaan: pertanyaan,
                                                selectkonsul
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch(error){
        console.log(error);
    }
});

Router.post('/listjawaban', (req, res) => {
    try{
        const { selectkonsul } = req.body;

        if(selectkonsul){
            Connection.query("SELECT t.id AS idtipe, q.pertanyaan AS pertanyaan, a.jawaban AS jawaban, ac.nama AS namauser FROM icare_aassessment a INNER JOIN icare_qassessment q ON q.id = a.id_pertanyaan INNER JOIN icare_consult_type t ON q.id_consult_type = t.id INNER JOIN icare_account ac ON ac.id = a.id_account WHERE t.id = ?", [selectkonsul], async (error, results) => {
                if(error){
                    res.status(500).json({
                        message: 'Get data jawaban error'
                    })
                } else if(results.length >= 0 ){
                    Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul) => {
                        if(error){
                            res.status(500).json({
                                message: error
                            })
                        } else {
                            Connection.query("SELECT id, nama FROM icare_consult_type WHERE id = ?", [selectkonsul], async (error, pilihkonsul) => {
                                if(error){
                                    res.status(500).json({
                                        message: error
                                    })
                                } else {
                                    Connection.query("SELECT q.id AS idp, q.pertanyaan AS pertanyaan FROM icare_qassessment q WHERE q.id_consult_type = ? AND q.status = 'aktif' ", [selectkonsul], async (error, pertanyaan) => {
                                        if(error){
                                            throw error;
                                        } else {
                                            /** Kirim data konsul */
                                            res.status(200).json({
                                                results: results,
                                                konsul : konsul,
                                                pilihkonsul: pilihkonsul,
                                                pertanyaan: pertanyaan,
                                                selectkonsul
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch(error){
        console.log(error);
    }
});

Router.post('/listhasil', (req, res) => {
    try{
        const { selectkonsul } = req.body;

        if(selectkonsul){
            Connection.query("SELECT id FROM icare_consult_type WHERE id = ?", [selectkonsul], async (error, cekkonsul) =>{
                if(error){
                    res.status(500).json({
                        message: 'Get data cek konsul error'
                    })
                } else if(cekkonsul.length == 0) {
                    res.status(403).json({
                        message: 'Konsul tidak terdaftar'
                    })
                } else if(cekkonsul.length > 0) {
                    Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = ? AND NOT u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = ? AND status = 'aktif') GROUP BY u.id", [selectkonsul, selectkonsul], async (error, results) => {
                        if(error){
                            res.status(500).json({
                                message: 'Get data hasil error'
                            })
                        } else if(results.length > 0 ){
                            Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul)=>{
                                if(error){
                                    res.status(500).json({
                                        message: 'Get data konsul error'
                                    })
                                } else if(konsul.length >= 0) {
                                    res.status(200).json({
                                        results,
                                        konsul, selectkonsul
                                    })
                                } else {
                                    res.status(500).json({
                                        message: 'Get data konsul error'
                                    })
                                }
                            })
                        } else if(results.length == 0){
                            res.status(403).json({
                                message: 'Belum ada peserta yang memberikan jawaban',
                                selectkonsul
                            })
                        } else {
                            res.status(500).json({
                                message: 'Get data hasil error'
                            })
                        };
                    })
                } else {
                    res.status(403).json({
                        message: 'Get data cek konsul error'
                    })
                }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }

    } catch(error){
        console.log(error);
    }
});

Router.post('/listhasilpeserta', (req, res) => {
    try{
        const { selectkonsul, selectpeserta } = req.body;

        if(selectkonsul && selectpeserta){
            /** cek konsul */
            Connection.query("SELECT id from icare_consult_type WHERE id = ?", [selectkonsul], async (error, cekkonsul) => {
                if(error){
                    res.status(500).json({
                        message: "Get cek acara error"
                    });
                } else if(cekkonsul.length == 0){
                    res.status(500).json({
                        message: "Konsultasi tidak terdaftar"
                    });
                } else if(cekkonsul.length > 0) {
                    /** cek peserta */
                    Connection.query("SELECT id from icare_account WHERE id = ?", [selectpeserta], async (error, cekpeserta) => {
                        if(error){
                            res.status(500).json({
                                message: "Get cek peserta error"
                            });
                        } else if(cekpeserta.length == 0) {
                            res.status(500).json({
                                message: "Peserta tidak terdaftar"
                            });
                        } else if(cekpeserta.length > 0) {
                            /** get data jawaban peserta berdasarkan acara terpilih */
                            Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, p.pertanyaan AS pertanyaan, j.jawaban AS jawaban, j.jawaban_essay AS jawaban_essay, p.sub_pertanyaan AS sub_pertanyaan, j.sub_jawaban AS sub_jawaban FROM icare_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = ? AND u.id = ?", [selectkonsul, selectpeserta], async (error, results)=>{
                                /** get data acara */
                                Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul)=>{
                                    if(error){
                                        res.status(500).json({
                                            message: "Get data konsul error"
                                        });
                                    } else if(konsul.length >= 0){
                                        /** get data peserta yg sudah menjawab dan blm ada kesimpulan */
                                        Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = ? AND NOT u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = ? AND status = 'aktif') GROUP BY u.id", [selectkonsul, selectkonsul], async (error, peserta) => {
                                            if(error){
                                                res.status(500).json({
                                                    message: "Get data peserta error"
                                                });
                                            }else if(peserta.length > 0){
                                                /** get biodata peserta */
                                                Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, u.tempat_lahir AS tempat_lahir, u.tanggal_lahir AS tanggal_lahir, u.jenis_kelamin AS jenis_kelamin, u.pendidikan AS pendidikan_terakhir, u.universitas AS asal_universitas, u.jurusan AS jurusan, u.phone AS phone FROM icare_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = ? AND u.id = ? GROUP BY u.id", [selectkonsul, selectpeserta], async (error, biodata) => {
                                                    if(error){
                                                        res.status(500).json({
                                                            message: "Get biodata peserta error"
                                                        });
                                                    } else if(biodata.length > 0) {
                                                        /** biodata tersedia */
                                                        res.status(200).json({
                                                            results, konsul, peserta, selectkonsul, selectpeserta, biodata
                                                        });
                                                    }
                                                })
                                            }else if(peserta.length == 0){
                                                res.status(403).json({
                                                    message: "Belum ada peserta yang memberikan jawaban"
                                                });
                                            }else{
                                                res.status(500).json({
                                                    message: "Get data peserta error"
                                                });
                                            }                                 
                                        })
                                    } else {
                                        res.status(500).json({
                                            message: "Get data konsul error"
                                        });
                                    }
                                })
                            })
                        } else {
                            res.status(500).json({
                                message: "Get cek peserta error"
                            });
                        }
                    })
                } else {
                    res.status(500).json({
                        message: "Get cek acara error"
                    });
                }
            })
        } else {
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch(error){
        console.log(error);
    }
});

Router.post('/listkesimpulan', (req, res) => {
    try{
        const { selectkonsul } = req.body;

        if(selectkonsul){
            Connection.query("SELECT id FROM icare_consult_type WHERE id = ?", [selectkonsul], async (error, cekkonsul) =>{
                if(error){
                    res.status(500).json({
                        message: 'Get data cek konsul error'
                    })
                } else if(cekkonsul.length == 0) {
                    res.status(403).json({
                        message: 'Konsul tidak terdaftar'
                    })
                } else if(cekkonsul.length > 0) {
                    Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = ? AND u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = ? AND status = 'aktif') GROUP BY u.id", [selectkonsul, selectkonsul], async (error, results) => {
                        if(error){
                            res.status(500).json({
                                message: 'Get data hasil error'
                            })
                        } else if(results.length > 0 ){
                            Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul)=>{
                                if(error){
                                    res.status(500).json({
                                        message: 'Get data konsul error'
                                    })
                                } else if(konsul.length >= 0) {
                                    res.status(200).json({
                                        results,
                                        konsul, selectkonsul
                                    })
                                } else {
                                    res.status(500).json({
                                        message: 'Get data konsul error'
                                    })
                                }
                            })
                        } else if(results.length == 0){
                            res.status(403).json({
                                message: 'Belum ada peserta yang diberikan kesimpulan',
                                selectkonsul
                            })
                        } else {
                            res.status(500).json({
                                message: 'Get data hasil error'
                            })
                        };
                    })
                } else {
                    res.status(403).json({
                        message: 'Get data cek konsul error'
                    })
                }
            })
        } else {
            /** Field kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }

    } catch(error){
        console.log(error);
    }
});

Router.post('/listkesimpulanpeserta', (req, res) => {
    try{
        const { selectkonsul, selectpeserta } = req.body;

        if(selectkonsul && selectpeserta){
            /** cek konsul */
            Connection.query("SELECT id from icare_consult_type WHERE id = ?", [selectkonsul], async (error, cekkonsul) => {
                if(error){
                    res.status(500).json({
                        message: "Get cek acara error"
                    });
                } else if(cekkonsul.length == 0){
                    res.status(500).json({
                        message: "Konsultasi tidak terdaftar"
                    });
                } else if(cekkonsul.length > 0) {
                    /** cek peserta */
                    Connection.query("SELECT id from icare_account WHERE id = ?", [selectpeserta], async (error, cekpeserta) => {
                        if(error){
                            res.status(500).json({
                                message: "Get cek peserta error"
                            });
                        } else if(cekpeserta.length == 0) {
                            res.status(500).json({
                                message: "Peserta tidak terdaftar"
                            });
                        } else if(cekpeserta.length > 0) {
                            /** get data jawaban peserta berdasarkan acara terpilih */
                            Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, p.pertanyaan AS pertanyaan, j.jawaban AS jawaban, j.jawaban_essay AS jawaban_essay, p.sub_pertanyaan AS sub_pertanyaan, j.sub_jawaban AS sub_jawaban FROM icare_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = ? AND u.id = ?", [selectkonsul, selectpeserta], async (error, results)=>{
                                /** get data acara */
                                Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul)=>{
                                    if(error){
                                        res.status(500).json({
                                            message: "Get data konsul error"
                                        });
                                    } else if(konsul.length >= 0){
                                        /** get data peserta yg sudah menjawab dan ada kesimpulan */
                                        Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = ? AND u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = ? AND status = 'aktif') GROUP BY u.id", [selectkonsul, selectkonsul], async (error, peserta) => {
                                            if(error){
                                                res.status(500).json({
                                                    message: "Get data peserta error"
                                                });
                                            }else if(peserta.length > 0){
                                                /** get data kesimpulan peserta */
                                                Connection.query("SELECT k.id AS idkesimpulan, k.id_consult_type AS idkonsul, a.nama AS tipekonsul, k.verified_by AS idpsikolog, p.nama AS namapsikolog, k.id_account AS idpeserta, k.conc AS kesimpulan FROM icare_conc k INNER JOIN icare_consult_type a ON a.id = k.id_consult_type INNER JOIN icare_account p ON p.id = k.verified_by WHERE k.id_consult_type = ? AND k.id_account = ? AND NOT k.status = 'hapus'", [selectkonsul, selectpeserta], async (error, datakesimpulan) => {
                                                    if(error){
                                                        res.status(500).json({
                                                            message: "Get data konsul error"
                                                        });
                                                    } else {
                                                        /** get biodata peserta */
                                                        Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, u.tempat_lahir AS tempat_lahir, u.tanggal_lahir AS tanggal_lahir, u.jenis_kelamin AS jenis_kelamin, u.pendidikan AS pendidikan_terakhir, u.universitas AS asal_universitas, u.jurusan AS jurusan, u.phone AS phone FROM icare_account u INNER JOIN icare_a2assessment j ON j.id_account = u.id INNER JOIN icare_q3assessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = ? AND u.id = ? GROUP BY u.id", [selectkonsul, selectpeserta], async (error, biodata) => {
                                                            if(error){
                                                                res.status(500).json({
                                                                    message: "Get biodata peserta error"
                                                                });
                                                            } else if(biodata.length > 0) {
                                                                /** biodata tersedia */
                                                                res.status(200).json({
                                                                    results, konsul, peserta, selectkonsul, selectpeserta, datakesimpulan, biodata
                                                                });
                                                            }
                                                        })
                                                    }
                                                })
                                            }else if(peserta.length == 0){
                                                res.status(403).json({
                                                    message: "Belum ada peserta yang memberikan jawaban"
                                                });
                                            }else{
                                                res.status(500).json({
                                                    message: "Get data peserta error"
                                                });
                                            }                                 
                                        })
                                    } else {
                                        res.status(500).json({
                                            message: "Get data konsul error"
                                        });
                                    }
                                })
                            })
                        } else {
                            res.status(500).json({
                                message: "Get cek peserta error"
                            });
                        }
                    })
                } else {
                    res.status(500).json({
                        message: "Get cek acara error"
                    });
                }
            })
        } else {
            res.status(500).json({
                message: "Field tidak boleh kosong"
            });
        }
    } catch(error){
        console.log(error);
    }
});


module.exports = Router;