var express = require('express');
var router = express.Router();

// подключение необходимых ресурсов из контроллера
var { navmenu, register_user } = require('../controllers/mainController');

/*
 Обработка POST и GET запросов по адресу /register
*/

// Рендеринг формы
router.get('/', function(req, res) {
  res.render('register', { 
    title: 'Whitesquare',
    pname: 'AUTH',
    navmenu: navmenu });
});

// Добавление в БД нового аккаунта
router.post('/', register_user);

module.exports = router;