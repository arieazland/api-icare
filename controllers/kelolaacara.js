const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcryptjs');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

/** Simpan Process */
exports.tambah = async (req, res) => {
    try {
        /** Cek session login */
        if(req.session.loggedIn){
            /** get data dari form input acara */
            const { namaacara, tempatacara, tanggalacara, jammulaiacara, jamakhiracara, keteranganacara } = req.body;
            /** query insert data acara ke database */
            Connection.query('INSERT INTO tb_acara SET ?', {id_acara: null, nama_acara: namaacara, tempat_acara: tempatacara, tanggal_acara : tanggalacara, waktu1_acara: jammulaiacara, waktu2_acara: jamakhiracara, keterangan_acara: keteranganacara, status_acara: "Belum Terlaksana", status_acaraaktif: 1}, (error) => {
                if(error){
                    /** jika error di tampilkan error log */
                    console.log(error)
                } else {
                    /** Jika tidak error response di kembalikan ke halaman acara dengan notifikasi berhasil*/
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: 'Input Acara Berhasil!'
                    }
                    res.redirect("/acara");
                }
            });
        } else{
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
            const { modalidacara, modalnamaacara, modaltempatacara, modaltanggalacara, modaljammulaiacara, modaljamakhiracara, modalketeranganacara, modalstatusacara } = req.body;
            /** query update data acara ke database */
            Connection.query('UPDATE tb_acara SET ? WHERE id_acara = ?', [{nama_acara: modalnamaacara, tempat_acara: modaltempatacara, tanggal_acara : modaltanggalacara, waktu1_acara: modaljammulaiacara, waktu2_acara: modaljamakhiracara, keterangan_acara: modalketeranganacara}, modalidacara], (error) => {
                if(error){
                    /** jika error di tampilkan error log */
                    console.log(error)
                } else {
                    /** Jika tidak error response di kembalikan ke halaman acara dengan notifikasi berhasil*/
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: 'Ubah Data Acara Berhasil!'
                    }
                    res.redirect("/acara");
                }
            });
        } else{
            /** Jika belum login di alihkan ke halaman login */
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
    }
};

/** Hapus Process */
exports.hapus = (req, res) => {
    try {
        /** Cek session login */
        if(req.session.loggedIn){
            /** get data dari form input acara */
            const { modalidacarahapus } = req.body;
            /** query update data acara ke database */
            Connection.query("UPDATE tb_acara SET ? WHERE id_acara = ?", [{status_acaraaktif: '0' }, modalidacarahapus], (error) => {
                if(error){
                    /** jika error di tampilkan error log */
                    console.log(error)
                } else {
                    /** Jika tidak error response di kembalikan ke halaman acara dengan notifikasi berhasil*/
                    req.session.sessionFlash2 = {
                        type: 'success',
                        message: 'Hapus Data Acara Berhasil!'
                    }
                    res.redirect("/acara");
                }
            });
        } else{
            /** Jika belum login di alihkan ke halaman login */
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
    }
};