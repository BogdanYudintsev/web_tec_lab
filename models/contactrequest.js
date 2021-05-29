
const { Sequelize } = require('sequelize');

// Описание модели таблицы contactrequest
module.exports = (sequelize) => {
  return sequelize.define('contactrequest', {
    /* id - основной ключ таблице, будет создаваться 
    и инкрементироваться автоматически при появлении новой записи */
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true
    },
    reqtype: {
        type: Sequelize.STRING,
        allowNull: true
    },
    reqtext: {
        type: Sequelize.TEXT,
        allowNull: false
    }
  });
}
