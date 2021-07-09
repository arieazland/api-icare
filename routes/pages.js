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
                    Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_account u INNER JOIN icare_aassessment j ON j.id_account = u.id INNER JOIN icare_qassessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = ? AND NOT u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = ? AND status = 'aktif') GROUP BY u.id", [selectkonsul, selectkonsul], async (error, results) => {
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
                            Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, p.pertanyaan AS pertanyaan, j.jawaban AS jawaban FROM icare_account u INNER JOIN icare_aassessment j ON j.id_account = u.id INNER JOIN icare_qassessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = ? AND u.id = ?", [selectkonsul, selectpeserta], async (error, results)=>{
                                /** get data acara */
                                Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul)=>{
                                    if(error){
                                        res.status(500).json({
                                            message: "Get data konsul error"
                                        });
                                    } else if(konsul.length >= 0){
                                        /** get data peserta yg sudah menjawab dan blm ada kesimpulan */
                                        Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_account u INNER JOIN icare_aassessment j ON j.id_account = u.id INNER JOIN icare_qassessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = ? AND NOT u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = ? AND status = 'aktif') GROUP BY u.id", [selectkonsul, selectkonsul], async (error, peserta) => {
                                            if(error){
                                                res.status(500).json({
                                                    message: "Get data peserta error"
                                                });
                                            }else if(peserta.length > 0){
                                                res.status(200).json({
                                                    results, konsul, peserta, selectkonsul, selectpeserta
                                                });
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
                    Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_account u INNER JOIN icare_aassessment j ON j.id_account = u.id INNER JOIN icare_qassessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = ? AND u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = ? AND status = 'aktif') GROUP BY u.id", [selectkonsul, selectkonsul], async (error, results) => {
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
                            Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta, p.pertanyaan AS pertanyaan, j.jawaban AS jawaban FROM icare_account u INNER JOIN icare_aassessment j ON j.id_account = u.id INNER JOIN icare_qassessment p ON p.id = j.id_pertanyaan WHERE p.id_consult_type = ? AND u.id = ?", [selectkonsul, selectpeserta], async (error, results)=>{
                                /** get data acara */
                                Connection.query("SELECT * FROM icare_consult_type WHERE NOT status_consult = 'hapus' ORDER BY nama ASC", async (error, konsul)=>{
                                    if(error){
                                        res.status(500).json({
                                            message: "Get data konsul error"
                                        });
                                    } else if(konsul.length >= 0){
                                        /** get data peserta yg sudah menjawab dan ada kesimpulan */
                                        Connection.query("SELECT u.id AS idpeserta, u.nama AS namapeserta FROM icare_account u INNER JOIN icare_aassessment j ON j.id_account = u.id INNER JOIN icare_qassessment p ON j.id_pertanyaan = p.id WHERE p.id_consult_type = ? AND u.id IN (SELECT id_account FROM icare_conc WHERE id_consult_type = ? AND status = 'aktif') GROUP BY u.id", [selectkonsul, selectkonsul], async (error, peserta) => {
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
                                                        res.status(200).json({
                                                            results, konsul, peserta, selectkonsul, selectpeserta, datakesimpulan
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


module.exports = Router;