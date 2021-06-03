const Mysql = require("mysql");
const Path = require("path");
const Dotenv = require("dotenv");
const Bcrypt = require('bcrypt');

Dotenv.config({ path: './.env' });
const Connection = require ("../DBconnection");

/** Login Process */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(email && password){
            Connection.query('SELECT * FROM icare_account WHERE email = ?', [email], async (error, results) =>{
                if( results.length == 0 ){
                    /** email salah */
                    res.status(401).json({
                        message: 'Email atau password salah'
                    });
                } else if( results.length > 0 && !(await Bcrypt.compare(password, results[0].password)) ){
                    /** password salah */
                    res.status(401).json({
                        message: 'Email atau password salah'
                    });
                } else if( results.length > 0 && await Bcrypt.compare(password, results[0].password) ) {
                    /** login sukses */
                    res.status(200).json({
                        message: 'Login Berhasil',
                        data: results
                    });
                }
            });
        } else {
            /** username dan password kosong */
            res.status(401).json({
                message: 'Field tidak boleh kosong'
            });
        }
    } catch (error) {
        console.log(error);
    }        
};

/** Get User List */
exports.userList = async (req, res) => {
    try{
        Connection.query('SELECT * FROM icare_account', async (error, results) =>{
            if(error){
                throw error;
            } else if(results.length > 0){
                /** Kirim data user */
                res.status(201).json({
                    data: results
                });
            } else if(results.length = 0){
                /** Data user kosong */
                res.status(500).json({
                    message: 'Data user kosong'
                })
            }
        })
    } catch (error) {
        console.log(error);
    } 
}

/** Admin Register Process */
exports.registerAdmin = (req, res) => {
    const { email, nama, password, password2 } = req.body;
    
    if(email && nama && password && password2){
        Connection.query('SELECT email FROM icare_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                throw error;
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "email sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                let hashedPassword = await Bcrypt.hash(password, 8);

                Connection.query('INSERT INTO icare_account SET ?', {id: null, email: email, nama: nama, password: hashedPassword, account_type: "admin"}, (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "admin berhasil di daftarkan",
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

/** Peserta Event Register Process */
exports.registerPesertaevent = (req, res) => {
    const { email, nama, password, password2 } = req.body;
    
    if(email && nama && password && password2){
        Connection.query('SELECT email FROM icare_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                throw error;
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "email sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                let hashedPassword = await Bcrypt.hash(password, 8);

                Connection.query('INSERT INTO icare_account SET ?', {id: null, email: email, nama: nama, password: hashedPassword, account_type: "peserta_event"}, (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "user event berhasil di daftarkan",
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

/** Peserta Reguler Register Process */
exports.registerPesertareguler = (req, res) => {
    const { email, nama, password, password2 } = req.body;
    
    if(email && nama && password && password2){
        Connection.query('SELECT email FROM icare_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                throw error;
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "email sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                let hashedPassword = await Bcrypt.hash(password, 8);

                Connection.query('INSERT INTO icare_account SET ?', {id: null, email: email, nama: nama, password: hashedPassword, account_type: "peserta_reguler"}, (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "user reguler berhasil di daftarkan",
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
    
    if(email && nama && password && password2){
        Connection.query('SELECT email FROM icare_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                throw error;
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "email sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                let hashedPassword = await Bcrypt.hash(password, 8);

                Connection.query('INSERT INTO icare_account SET ?', {id: null, email: email, nama: nama, password: hashedPassword, account_type: "konsultan"}, (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "user konsultan berhasil di daftarkan",
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

/** Psikolog Register Process */
exports.registerPsikolog = (req, res) => {
    const { email, nama, password, password2 } = req.body;
    
    if(email && nama && password && password2){
        Connection.query('SELECT email FROM icare_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                throw error;
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "email sudah terdaftar, silahkan login",
                });
                
            } else if( password !== password2) {
                /** password dan password konfirmasi tidak sama */
                res.status(500).json({
                    message: "password dan konfirmasi password tidak sama",
                });

            } else if (results.length == 0){
                /** Username tersedia */
                let hashedPassword = await Bcrypt.hash(password, 8);

                Connection.query('INSERT INTO icare_account SET ?', {id: null, email: email, nama: nama, password: hashedPassword, account_type: "psikologis"}, (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "user psikolog berhasil di daftarkan",
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

/** Edit Account Process */
exports.edit = (req, res) => {
    const { id, email, nama, } = req.body;
    
    if(id && email && nama){
        Connection.query('SELECT email FROM icare_account WHERE email = ?', [email], async (error, results) => {
            if(error) { 
                throw error;
            } else if(results.length > 0){
                /** username sudah dipakai */
                res.status(500).json({
                    message: "email sudah terdaftar dan tidak bisa dilakukan perubahan",
                });

            } else if (results.length == 0){
                /** Username tersedia */

                Connection.query('UPDATE icare_account SET ? WHERE id = ?', [{email: email, nama: nama}, id], (error, results) => {
                    if(error){
                        console.log(error)
                    } else {
                        /** Registrasi berhasil dilanjutkan ke login */
                        res.status(201).json({
                            message: "nama user berhasil di ubah",
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

/** Delete Account Process */
exports.deleteUser = (req, res) => {
    const { id } = req.body;
    
    if(id){
        Connection.query('UPDATE icare_account SET ? WHERE id = ? ', [{account_type: 'nonaktif'}, id], async (error, results) => {
            if(error) { 
                throw error;
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
            message: "field tidak boleh kosong",
        });
    }
};