const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

// Описание модели таблицы login (зарегистрированные пользователи)
module.exports = (sequelize) => {
  return sequelize.define('login', {
      id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
      },
      username: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
      },
      email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
      },
      password: {
          type: Sequelize.STRING,
          allowNull: false
      }
    });
}