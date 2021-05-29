var express = require('express');
var router = express.Router();

// подключение необходимых ресурсов из контроллера
var { navmenu, login_user } = require('../controllers/mainController');

/*
 Обработка POST и GET запросов по адресу /login
*/

// Рендеринг формы
router.get('/', function(req, res) {
  res.render('login', { 
    title: 'Whitesquare',
    pname: 'AUTH',
    navmenu: navmenu });
});

// Проверка корректного ввода логина и пароля
router.post('/', (req, res) => {
  // Если данные отправлены НЕ через кнопку "Регистрация"
  if (!req.body.regBtn) {
    // выполняем авторизацию
    login_user(req, res);
  }
  // иначе переадресуем на страницу регистрации
  else res.redirect('/register');
});

module.exports = router;