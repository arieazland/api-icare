const Express = require("express");
const Router = Express.Router();
const Dotenv = require("dotenv");
// Set Moment Format engine
const Moment = require("moment");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

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

module.exports = Router;