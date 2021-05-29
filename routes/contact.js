var express = require('express');
const session = require('express-session');
var router = express.Router();

// подключение необходимых ресурсов из контроллера
var { navmenu, sessionCheck } = require('../controllers/mainController');

/* Обработка перехода по адресу /contact и
рендеринг соответствующего шаблона */
router.get('/', sessionCheck, function(req, res) {
  res.render('contact', { 
    title: 'Whitesquare',
    pname: 'CONTACT',
    user: req.session.user,
    navmenu: navmenu });
});

module.exports = router;