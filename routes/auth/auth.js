var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var connection = require('../../library/database');

/**
 * REGISTER - Menampilkan form register
 */
router.get('/register', function(req, res, next) {
    res.render('auth/register', {
        name: '',
        email: ''
    });
});

/**
 * REGISTER - Store data user baru
 */
router.post('/register', function(req, res, next) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;
    let errors = false;

    // Validasi input
    if (name.length === 0) {
        errors = true;
        req.flash('error', 'Silahkan Masukkan Nama');
    }

    if (email.length === 0) {
        errors = true;
        req.flash('error', 'Silahkan Masukkan Email');
    }

    if (password.length === 0) {
        errors = true;
        req.flash('error', 'Silahkan Masukkan Password');
    }

    if (password !== confirm_password) {
        errors = true;
        req.flash('error', 'Password dan Konfirmasi Password tidak cocok');
    }

    // Jika ada error, render kembali form
    if (errors) {
        res.render('auth/register', {
            name: name,
            email: email
        });
    } else {
        // Cek apakah email sudah terdaftar
        connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                req.flash('error', 'Email sudah terdaftar!');
                res.render('auth/register', {
                    name: name,
                    email: email
                });
            } else {
                // Enkripsi password dengan bcrypt
                bcrypt.hash(password, 10, function(err, hash) {
                    if (err) throw err;

                    let formData = {
                        name: name,
                        email: email,
                        password: hash
                    };

                    // Insert user baru
                    connection.query('INSERT INTO users SET ?', formData, function(err, result) {
                        if (err) {
                            req.flash('error', err);
                            res.render('auth/register', {
                                name: name,
                                email: email
                            });
                        } else {
                            req.flash('success', 'Registrasi Berhasil! Silahkan Login.');
                            res.redirect('/auth/login');
                        }
                    });
                });
            }
        });
    }
});

/**
 * LOGIN - Menampilkan form login
 */
router.get('/login', function(req, res, next) {
    res.render('auth/login', {
        email: ''
    });
});

/**
 * LOGIN - Proses autentikasi
 */
router.post('/login', function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let errors = false;

    if (email.length === 0 || password.length === 0) {
        errors = true;
        req.flash('error', 'Silahkan Masukkan Email dan Password');
        res.render('auth/login', {
            email: email
        });
    }

    if (!errors) {
        connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows) {
            if (err) throw err;

            if (rows.length === 0) {
                req.flash('error', 'Email atau Password salah!');
                res.render('auth/login', {
                    email: email
                });
            } else {
                let user = rows[0];

                // Verifikasi password dengan bcrypt
                bcrypt.compare(password, user.password, function(err, result) {
                    if (err) throw err;

                    if (result) {
                        // Password benar, set session
                        req.session.user_id = user.id;
                        req.session.user_name = user.name;
                        req.session.user_email = user.email;
                        req.session.loggedin = true;

                        req.flash('success', 'Login Berhasil!');
                        res.redirect('/posts');
                    } else {
                        // Password salah
                        req.flash('error', 'Email atau Password salah!');
                        res.render('auth/login', {
                            email: email
                        });
                    }
                });
            }
        });
    }
});

/**
 * LOGOUT - Proses logout
 */
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) throw err;
        res.redirect('/auth/login');
    });
});

module.exports = router;
