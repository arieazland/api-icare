const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
//const Bcrypt = require('bcryptjs');
const md5 = require('md5')

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

const Moment = require("moment");
const { resolve } = require("path");
require("moment/locale/id");  // without this line it didn't work
Moment.locale('id');

/** Login Process */
exports.login = async (req, res) => {
    const { email, password, ipadd, namabrowser, namaos, namaplatform } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    // var ipadd = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).substr(7)
    // ipadd = ip.substr(7)
    // console.log(ipadd);

    if(email && password){

        try{
            var unhased = md5(password);
            const cek_user = await new Promise((resolve, reject) => {
                Connection.query("SELECT * FROM cdc_account WHERE email = ?", [email], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_user.length == 0){
                /** email tidak ada */
                throw new Error('Email atau password salah');
            } else if(cek_user.length > 0 && unhased!=cek_user[0].password){
                /** password salah */
                throw new Error('Email atau password salah');
            } else if(cek_user.length > 0 && cek_user[0].account_type == 'nonaktif'){
                /** user nonaktif */
                throw new Error('User Account anda nonaktif');
            } else if(cek_user.length > 0 && unhased === cek_user[0].password && cek_user[0].account_type!='nonaktif'){
                const save_activity = await new Promise((resolve, reject) => {
                    Connection.query("INSERT INTO icare_log SET ?", [{id: null, id_account: cek_user[0].id, email_account: cek_user[0].email, aktifitas: 'login', ip_address: ipadd, nama_browser: namabrowser, nama_os: namaos, nama_platform: namaplatform, date_created: tanggal, time_created: waktu}], (error, results) => {
                        if(error){
                            reject(error)
                        } else {
                            resolve("true")
                        }
                    })
                })
                if(save_activity === "true"){
                    res.status(200).json({
                        message: 'Login Berhasil',
                        data: cek_user
                    });
                } else {
                    /** send error */
                    throw new Error('Login Gagal');
                }
                
            } else {
                /** send error */
                throw new Error('Login Gagal');
            }
        } catch (e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** username dan password kosong */
        res.status(500).json({
            message: 'Field tidak boleh kosong'
        });
    }     
};

/** Admin Register Process */
exports.registerAdmin = (req, res) => {
    const { email, nama, password, password2 } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(email && nama && password && password2){
        Connection.query('SELECT email FROM cdc_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                // throw error;
                res.status(500).json({
                    message: error
                });
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "Email sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "Password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                // let hashedPassword = await Bcrypt.hash(password, 8);
                let hashedPassword = md5(password);

                Connection.query('INSERT INTO cdc_account SET ?', {id: null, email: email, nama: nama, 
                    password: hashedPassword, password_nonhashed: password, non_hashed: password, account_type: "admin", date_created: tanggal, time_created: waktu}, 
                    (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "User account berhasil di daftarkan",
                        });
                    }
                })
            }
        })
    } else {
        /** Field tidak boleh kosong */
        res.status(500).json({
            message: "Field tidak boleh kosong",
        });
    }
};

/** Register Peserta Process */
exports.registerPeserta = async (req, res) => {
    const { username, nama, email, password, password2, jenis_kelamin, nomor_kontak, tempat_lahir, tanggal_lahir, pendidikan, universitas, jurusan } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");

    if(username && nama && email && password && password2 && jenis_kelamin && nomor_kontak && tempat_lahir && tanggal_lahir && pendidikan && universitas && jurusan){
        try{
            /** cek email */
            const cek_email = await new Promise((resolve, reject) => {
                Connection.query("SELECT email FROM cdc_account WHERE email = ?", [email], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_email.length === 0){
                /** email belum terdaftar */
                /** cek kesamaan password dengan password konfirmasi */
                if(password === password2){
                    /** password dan konfirmasi password sama */

                    /** hashing password */
                    // let hashedPassword = await Bcrypt.hash(password, 8);
                    let hashedPassword = md5(password);

                    /** insert data ke database */
                    const insert_data_peserta = await new Promise((resolve, reject) => {
                        Connection.query("INSERT INTO cdc_account SET ?", {id: null, email: email, nama: nama, username: username,password: hashedPassword, password_nonhashed: password, non_hashed: password, jenis_kelamin: jenis_kelamin, phone: nomor_kontak, tempat_lahir: tempat_lahir, tanggal_lahir: tanggal_lahir, pendidikan: pendidikan, universitas: universitas, jurusan: jurusan, account_type: "peserta_event", date_created: tanggal, time_created: waktu}, (error, results) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve("true")
                            }
                        })
                    })                    
                    if(insert_data_peserta === "true"){
                        /** insert data peserta berhasil */
                        res.status(201).json({
                            message: "Simpan data registrasi berhasil, silahkan login",
                        });
                    } else {
                        /** insert data peserta gagal */
                        throw new Error('Gagal simpan data registrasi');
                    }
                } else {
                    /** password dan konfirmasi password tidak sama */
                    throw new Error('Mohon di cek kembali password dan konfirmasi password anda tidak sama');
                }
            } else{
                /** email sudah terdaftar */
                throw new Error('Email Sudah Terdaftar, silahkan login atau cek kembali email anda');
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

/** Peserta Event Register Process */
exports.registerPesertaevent = (req, res) => {
    const { email, nama, password, password2 } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(email && nama && password && password2){
        Connection.query('SELECT email FROM cdc_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                // throw error;
                res.status(500).json({
                    message: error
                });
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "Email sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "Password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                // let hashedPassword = await Bcrypt.hash(password, 8);
                let hashedPassword = md5(password);

                Connection.query('INSERT INTO cdc_account SET ?', {id: null, email: email, nama: nama, 
                    password: hashedPassword, password_nonhashed: password, non_hashed: password, account_type: "peserta_event", date_created: tanggal, time_created: waktu}, 
                    (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "User account berhasil di daftarkan",
                        });
                    }
                })
            }
        })
    } else {
        /** Field tidak boleh kosong */
        res.status(500).json({
            message: "Field tidak boleh kosong",
        });
    }
};

/** Peserta Reguler Register Process */
exports.registerPesertareguler = (req, res) => {
    const { email, nama, password, password2 } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(email && nama && password && password2){
        Connection.query('SELECT email FROM cdc_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                // throw error;
                res.status(500).json({
                    message: error
                });
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "Email sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "Password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                // let hashedPassword = await Bcrypt.hash(password, 8);
                let hashedPassword = md5(password);

                Connection.query('INSERT INTO cdc_account SET ?', {id: null, email: email, nama: nama, 
                    password: hashedPassword, password_nonhashed: password, non_hashed: password, account_type: "peserta", date_created: tanggal, time_created: waktu}, 
                    (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "User account berhasil di daftarkan",
                        });
                    }
                })
            }
        })
    } else {
        /** Field tidak boleh kosong */
        res.status(500).json({
            message: "field tidak boleh kosong",
        });
    }
};

/** Konsultan Register Process */
exports.registerKonsultan = (req, res) => {
    const { email, nama, password, password2 } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(email && nama && password && password2){
        Connection.query('SELECT email FROM cdc_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                // throw error;
                res.status(500).json({
                    message: error
                });
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "Email sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "Password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                // let hashedPassword = await Bcrypt.hash(password, 8);
                let hashedPassword = md5(password);

                Connection.query('INSERT INTO cdc_account SET ?', {id: null, email: email, nama: nama, 
                    password: hashedPassword, password_nonhashed: password, non_hashed: password, account_type: "konsultan", date_created: tanggal, time_created: waktu}, 
                    (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "User account berhasil di daftarkan",
                        });
                    }
                })
            }
        })
    } else {
        /** Field tidak boleh kosong */
        res.status(500).json({
            message: "Field tidak boleh kosong",
        });
    }
};

/** Psikolog Register Process */
exports.registerPsikolog = (req, res) => {
    const { email, nama, password, password2 } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(email && nama && password && password2){
        Connection.query('SELECT email FROM cdc_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                // throw error;
                res.status(500).json({
                    message: error
                });
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "Email sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "Password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                // let hashedPassword = await Bcrypt.hash(password, 8);
                let hashedPassword = md5(password);

                Connection.query('INSERT INTO cdc_account SET ?', {id: null, email: email, nama: nama, 
                    password: hashedPassword, password_nonhashed: password, non_hashed: password, account_type: "psikologis", date_created: tanggal, time_created: waktu}, 
                    (error) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil  */
                        Connection.query("SELECT * FROM cdc_account", async (error, results) =>{
                            if(error){ 
                                throw error; 
                            } else if(results.length >= 0){
                                /** Kirim data user */
                                res.status(201).json({
                                    message: "User account berhasil di daftarkan",
                                });
                            }
                        });
                    }
                })
            }
        })
    } else {
        /** Field tidak boleh kosong */
        res.status(500).json({
            message: "Field tidak boleh kosong",
        });
    }
};

/** Edit Account Process */
exports.edit = (req, res) => {
    const { id, email, nama, } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(id && email && nama){
        Connection.query('SELECT email FROM cdc_account WHERE email = ? AND id <> ?', [email, id], async (error, results) => {
            if(error) { 
                // throw error;
                res.status(500).json({
                    message: error
                });
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "Email sudah terdaftar silahkan gunakan email yang lain",
                });

            } else if (results.length == 0){
                /** Username tersedia */

                Connection.query('UPDATE cdc_account SET ? WHERE id = ?', [{email: email, nama: nama, 
                    date_updated: tanggal, time_updated: waktu}, id], (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "Data user berhasil di ubah",
                        });
                    }
                })
            }
        })
    } else {
        /** Field tidak boleh kosong */
        res.status(500).json({
            message: "Field tidak boleh kosong",
        });
    }
};

/** Delete Account Process */
exports.delete = (req, res) => {
    const { id } = req.body;
    var tanggal = Moment().format("YYYY-MM-DD");
    var waktu = Moment().format("HH:mm:ss");
    
    if(id){
        Connection.query('UPDATE cdc_account SET ? WHERE id = ? ', [{account_type: 'nonaktif', date_updated: tanggal, 
        time_updated: waktu}, id], async (error, results) => {
            if(error) { 
                // throw error;
                res.status(500).json({
                    message: error
                });
            } else {
                /** username dinonaktifkan */
                res.status(201).json({
                    message: "User account berhasil di hapus",
                });
            }
        })
    } else {
        /** Field tidak boleh kosong */
        res.status(500).json({
            message: "Field tidak boleh kosong",
        });
    }
};

/** Ganti password Process */
exports.gantiPassword = (req, res) => {
    try{
        const { id, passwordlama, password, password2 } = req.body
        let hashedPassword = md5(password);

        if(id && passwordlama && password && password2){
            if(password == password2){
                Connection.query("SELECT * FROM cdc_account WHERE id = ?", [id], async (error, cekid) => {
                    if(error){
                        /** error */
                        res.status(500).json({
                            message: error,
                        });
                    } else if(cekid.length == 0) {
                        /** idaccount tidak ada */
                        res.status(403).json({
                            message: "User tidak terdaftar",
                        });
                    } else if(cekid.length > 0 && hashedPassword!=cekid[0].password) {
                        /** password lama tidak sesuai */
                        res.status(403).json({
                            message: "Password lama tidak sesuai",
                        });
                    } else if(cekid.length > 0 && cekid[0].account_type == 'nonaktif') {
                        /** user nonaktif */
                        res.status(403).json({
                            message: "User nonaktif",
                        });
                    } else if(cekid.length > 0 && hashedPassword===cekid[0].password && cekid[0].account_type != 'nonaktif'){
                        /** hash password */
                        // let hashedPassword = await Bcrypt.hash(password);

                        /** user aktif dan password lama sesuai, lakukan update password */
                        Connection.query("UPDATE cdc_account SET ? WHERE id = ?", [{password: hashedPassword, non_hashed: password}, id], async (error, results) => {
                            if(error){
                                /** error */
                                res.status(500).json({
                                    message: error,
                                });
                            } else {
                                /** update password berhasil */
                                res.status(200).json({
                                    message: "Password berhasil diubah",
                                });
                            }
                        })
                    } else {
                        /** error */
                        res.status(500).json({
                            message: "Error, please contact developer",
                        });
                    }
                })
            } else if(password != password2) {
                /** password baru dan konfirmasi password tidak sama */
                res.status(500).json({
                    message: "Password baru dan konfirmasi password baru tidak sama",
                });
            } else {
                /** error */
                res.status(500).json({
                    message: "Error, please contact developer",
                });
            }
        } else {
            /** Field tidak boleh kosong */
            res.status(500).json({
                message: "Field tidak boleh kosong",
            });
        }
    } catch(error) {
        /** Error */
        res.status(500).json({
            message: error,
        });
    }
}

/** Reset password Process */
exports.resetPassword = async (req, res) => {
    const { id, password, password2 } = req.body;

    if(id && password && password2){
        try{
            /** cek id */
            const cek_user = await new Promise((resolve, reject) => {
                Connection.query("SELECT id FROM cdc_account WHERE id = ?", [id], (error, results) => {
                    if(error){
                        reject(error)
                    } else {
                        resolve(results)
                    }
                })
            })
            if(cek_user.length > 0){

                /** cek password == password2 */
                if(password === password2){
                    /** update password */
                    let hashedPassword = md5(password);

                    const update_password = await new Promise((resolve, reject) => {
                        Connection.query("UPDATE cdc_account SET ? WHERE id = ?", [{password: hashedPassword, non_hashed: password}, id], (error) => {
                            if(error){
                                reject(error)
                            } else {
                                resolve("true")
                            }
                        })
                    })
                    if(update_password === "true"){
                        res.status(201).json({
                            message: "Reset password berhasil, silahkan login"
                        });
                    } else {
                        /** User tidak terdaftar */
                        throw new Error('Reset password gagal');
                    }
                } else {
                    /** User tidak terdaftar */
                    throw new Error('Password dan konfirmasi password tidak sama');
                }

            } else if(cek_user.length === 0){
                /** User tidak terdaftar */
                throw new Error('User tidak terdaftar');
            } else {
                /** Get data user error */
                throw new Error('Get data user, Error');
            }


        } catch(e) {
            /** send error */
            res.status(400).json({ message: e.message });
        }
    } else {
        /** Field tidak boleh kosong */
        res.status(500).json({
            message: "Field tidak boleh kosong",
        });
    }
}