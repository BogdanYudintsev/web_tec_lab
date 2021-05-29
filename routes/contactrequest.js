var express = require('express');
var router = express.Router();

var mainController = require('../controllers/mainController');  // подключение контроллера

/*
Привязываем методы контроллера к соответствующим маршрутам
*/
router.get('/', mainController.get_contact_req_all);
router.get('/author', mainController.get_contact_req_by_firstname);
router.get('/:id', mainController.get_contact_req_by_id);
router.post('/', mainController.create_contact_req);
router.put('/:id', mainController.update_contact_req_by_id);
router.delete('/:id', mainController.delete_contact_req_by_id);

module.exports = router;