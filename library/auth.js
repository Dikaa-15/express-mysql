/**
 * Middleware untuk mengecek apakah user sudah login
 * Jika belum login, redirect ke halaman login
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.loggedin) {
        // User sudah login, lanjut ke next middleware/route
        return next();
    } else {
        // User belum login, redirect ke halaman login
        req.flash('error', 'Silahkan login terlebih dahulu!');
        return res.redirect('/auth/login');
    }
}

/**
 * Middleware untuk mengecek apakah user sudah login
 * Jika sudah login, redirect ke halaman posts
 * Digunakan untuk halaman login/register agar tidak bisa diakses saat sudah login
 */
function isGuest(req, res, next) {
    if (req.session && req.session.loggedin) {
        // User sudah login, redirect ke posts
        return res.redirect('/posts');
    } else {
        // User belum login, lanjut ke next middleware/route
        return next();
    }
}

module.exports = {
    isAuthenticated,
    isGuest
};
