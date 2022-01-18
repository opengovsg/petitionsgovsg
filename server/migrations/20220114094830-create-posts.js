'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      request: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      references: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('OPEN', 'CLOSED', 'DRAFT'),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      fullname: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      salt: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('posts')
  },
}
