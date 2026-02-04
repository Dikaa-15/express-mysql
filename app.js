var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//library
var flash   = require('express-flash');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts'); // <-- route posts
var authRouter = require('./routes/auth/auth'); // <-- route auth

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set favicon path
app.use('/favicon.ico', express.static('public/images/favicon.svg'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  cookie: { 
    maxAge: 60000 
  },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}))

app.use(flash())

// Middleware untuk membuat session tersedia di semua views
app.use(function(req, res, next) {
  res.locals.session = req.session;
  res.locals.messages = req.flash();
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter); // use route posts di Express
app.use('/auth', authRouter); // use route auth di Express

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Set port dan listen
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.listen(port, function() {
  console.log('Server is running on port ' + port);
});

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

module.exports = app;
