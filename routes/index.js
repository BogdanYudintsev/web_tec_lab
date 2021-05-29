var express = require('express');
var router = express.Router();

// подключение необходимых ресурсов из контроллера
// (переменную navmenu, содержащую структуру навигационного меню)
var { navmenu, sessionCheck } = require('../controllers/mainController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Whitesquare',
    pname: 'HOME',
    subjs: [ "SUBJ_1", "SUBJ_2", "SUBJ_3", "SUBJ_4", "SUBJ_5" ],
    imgs: [ "img1.jpg", "img2.jpg" ],
    navmenu: navmenu } );
});

// Обработка POST-запроса (принимаем данные, отправленные из формы на странице /contact)
router.post("/", function (req, res) {
  console.log(req.body);  // выводим в консоль полученные данные
  if(!req.body) return response.sendStatus(400);
  // Парсим принятые данные
  try {
    var msg = req.body.firstname + ", ваш запрос получен !";
  } catch(err) {
    console.error(err);
  }

  res.json({ message: msg }); // отправляем ответ
});

module.exports = router;
