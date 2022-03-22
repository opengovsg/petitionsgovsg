'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('addressees', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      shortName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      openToPublic: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      officerEmails: {
        allowNull: true,
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('addressees')
  },
}
