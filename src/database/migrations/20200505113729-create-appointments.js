'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        allowNull:false,
        type: Sequelize.DATE
      },
      user_id: {
        type:Sequelize.INTEGER,
        references: {model:'Users',key:'id'},
        onUpdate:'CASCADE',
        onDelete:'SET NULL',
        allowNull:true
      },
      canceled_at:{
        type:Sequelize.INTEGER,
      },
      provider_id:{
        type:Sequelize.INTEGER,
        references: {model:'Users',key:'id'},
        onUpdate:'CASCADE',
        onDelete:'SET NULL',
        allowNull:true
      },
      canceled_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Files');
  }
};