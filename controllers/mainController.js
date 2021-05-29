/*
В модулях-контроллерах реализуются методы (бизнес-логика) для работы с объектами БД.
Если в вашем приложении используется несколько моделей БД и для каждой модели реализуются
CRUD-операции, то хорошей практикой будет являться реализация ОТДЕЛЬНЫХ контроллеров для каждой модели.
*/
const { ContactRequest, Login } = require('../sequelize');     // подключаем объект модели БД из модуля инициализации sequelize.js
const bcrypt = require('bcrypt');       // подключаем крипто-библиотеку для валидации пароля

exports.navmenu = [
    {
        name: 'HOME',
        addr: '/'
    },
    {
        name: 'ABOUT US',
        addr: '#'
    },
    {
        name: 'SERVICES',
        addr: '#'
    },
    {
        name: 'PROJECTS',
        addr: '#'
    },
    {
        name: 'MEMBERS',
        addr: '#'
    },
    {
        name: 'CONTACT',
        addr: '/contact'
    }
];

// Функция для проверки авторизации пользователя
exports.sessionCheck = (req, res, next) => {
    // Если не установлен параметр сессии user или значение cookie 'AuthToken' не равно логину пользователя
    if (!req.session.user || req.cookies['AuthToken'] != req.session.user) {
        // переадресуем на страницу /login
        res.redirect('/login');
    } else {
        // иначе исполняем следующую функцию обработчика
        next();
    }    
};


// Показать список всех запросов.
exports.get_contact_req_all = function(req, res) {
    ContactRequest.findAll({ raw: true })
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving requests!"
      });
    });
};
  
// Показать запрос по id.
// Эквивалентно SQL-запросу: SELECT * FROM contactrequests WHERE id = <req.params.id>;
exports.get_contact_req_by_id = function(req, res) {
    ContactRequest.findByPk(req.params.id)
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
};
  
// Показать запрос по имени автора.
exports.get_contact_req_by_firstname = function(req, res) {
    ContactRequest.findAll({ where: { firstname: req.query.firstname } })
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
};
  
// Создать новый запрос.
exports.create_contact_req = function(req, res) {
    // Проверяем полученные данные на наличие обязательных полей (firstname и reqtext)
    if (!req.body.firstname || !req.body.reqtext) {
            res.status(400).json({ message: "Data validation error!" });    // если данные не найдены, возвращаем HTTP-код 400
        return;
    }

    // Создаем объект ContactRequest из json-данных
    var newContactRequest = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        reqtype: req.body.reqtype,
        reqtext: req.body.reqtext
    };
    // Записываем объект в БД
    // Эквивалентно SQL-запросу: INSERT INTO `contactrequests` (`id`,`firstname`,`lastname`,`reqtype`,`reqtext`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?,?,?);
    ContactRequest.create(newContactRequest)
    .then(data => {
        res.json({ message: "ContactRequest Created!" });
    })
      .catch(err => {
        res.status(500).json({ message: err.message });
    });
};
  
// Удалить запрос по id в таблице
exports.delete_contact_req_by_id = function(req, res) {
    ContactRequest.destroy({ where: { id: req.params.id } })
    .then(data => {
        res.json({ message: "ContactRequest Deleted!" });
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
};
  
// Обновить текст запроса по id в таблице
exports.update_contact_req_by_id = function(req, res) {
    // Проверяем полученные данные на наличие обязательного поля reqtext
    if (!req.body.reqtext) {
        res.status(400).json({ message: "Data validation error!" });
    return;
    }
    // Обновляем запись в БД
    // Эквивалентно SQL-запросу: UPDATE contactrequests SET reqtext = <req.body.reqtext> WHERE id = <req.params.id>
    ContactRequest.update({ reqtext: req.body.reqtext }, { where: { id: req.params.id } })
    .then(data => {
        res.json({ message: "ContactRequest Updated!" });
    })
    .catch(err => {
        res.status(500).json({ message: err.message });
    });
};

// Валидация пользователя по логину и паролю
exports.login_user = function(req, res) {
    // Получаем логин и пароль из данных формы
    var username = req.body.loginField;
    var password = req.body.passField;
    // Ищем пользователя в БД
    Login.findOne({ where: { username: username } }).then(user => {
        // если пользователь не найден переадресуем на страницу /login
        if (!user) {
            res.redirect('/login');
        // если пользователь найден, проверяем пароль
        } else if (!bcrypt.compareSync(password, user.password)) {
            // если пароль не прошел проверку, переадресуем на страницу /login
            res.redirect('/login');
        } else {
            // иначе регистрируем сессию пользователя (записываем логин пользователя в параметр user)
            req.session.user = user.username;
            // высылаем сессионную cookie AuthToken с логином
            res.cookie('AuthToken', user.username);
            res.redirect('/');
        }
    })
    .catch(err => {
        // в случае исключения возвращаем код 500 + json-ответ с ошибкой
        res.status(500).json({ message: err.message });
    });
}

// Создание нового аккаунта
exports.register_user = function(req, res) {
    // Создаем хеш пароля с солью
    const salt = bcrypt.genSaltSync();
    var hashed = bcrypt.hashSync(req.body.passField, salt);
    // Создаем объект Login из данных формы
    var newLogin = {
        username: req.body.loginField,
        password: hashed,
        email: req.body.emailField
    };
    // Записываем объект в БД
    Login.create(newLogin)
    .then(user => {
        console.log(`Registered as ${user.username}`);
        // в случае успешной записи переадресуем пользователя на страницу авторизации
        res.redirect('/login');
    })
    .catch(err => {
        // в случае исключения возвращаем код 500 + json-ответ с ошибкой
        res.status(500).json({ message: err.message });
    });
};