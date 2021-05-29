/* 
Модуль инициализации подключения к БД и ORM-моделей
*/
const Sequelize = require('sequelize');   // подключаем пакет sequalize
const ContactRequestModel = require('./models/contactrequest');   // подключаем модель, реализованную в contactrequest.js
const LoginModel = require('./models/login');

// Подключение БД MySQL (используем в релизной версии приложения)
/*const sequelize = new Sequelize("testappdb", "usr", "qwerty", {
  dialect: "mysql",
  host: "192.168.56.104"
});
*/
// Подключение к БД SQLite (используем в процессе разработки приложения)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "testappdb.sqlite"
});

/* Создаем объект модели БД.
С данным объектом далее можно будет работать, осуществляя операции 
выборки (SELECT), вставки (INSERT), обновления (UPDATE) и т.д.
*/
const ContactRequest = ContactRequestModel(sequelize);
const Login = LoginModel(sequelize);

/* Синхронизация моделей приложения с БД.
ВАЖНО! Если в инструкцию синхронизации передать параметр:
sequelize.sync({ force: true })
то все одноименные таблицы в БД будут удалены (DROP TABLE) и созданы заново!
*/
var syncdb = function() {
    sequelize.sync().then( result => {
    //console.log(result);
    console.log("Syncing DataBase is done!");
    })
    .catch(err => console.log(err));
};

// Экспорт функции синхронизации и ваших объектов моделей БД 
// для использования в других модулях
module.exports = {
    syncdb,
    ContactRequest,
    Login
}