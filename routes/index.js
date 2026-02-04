var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Redirect ke posts jika sudah login, atau ke login jika belum
  if (req.session && req.session.loggedin) {
    res.redirect('/posts');
  } else {
    res.redirect('/auth/login');
  }
});

module.exports = router;
