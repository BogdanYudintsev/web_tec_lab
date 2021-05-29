var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// Подключение обработчиков маршрутов
var indexRouter = require('./routes/index');
var contactRouter = require('./routes/contact');
var contactrequestRouter = require('./routes/contactrequest');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

var app = express();
var helmet = require('helmet');

// Синхронизация БД (если необходимо)
var sequelize = require('./sequelize');
sequelize.syncdb();

// Подключение шаблонизатора
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Инициализация промежуточного обработчика сессий пользователей
app.use(session({
  key: 'user_sid',
  secret: 'anypassword',
  resave: false,
  saveUninitialized: true,
  cookie: {
      signed: false,
      maxAge: 600000
  }
}));
app.use(helmet());

/* Эта промежуточная функция будет выполнять при каждом запросе
 Здесь, если необходимо, можно реализовать дополнительную логику работы с сессиями,
 например, данная функция очищает cookie, если пользователь не залогинен */
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

// Привязка обработчиков маршрутов к маршрутам
app.use('/', indexRouter);
app.use('/contact', contactRouter);
app.use('/api/contactrequest', contactrequestRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

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

module.exports = app;
