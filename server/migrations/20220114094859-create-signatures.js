'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('signatures', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      hashedUserSgid: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      postId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'posts', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fullname: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING, // e.g. support, oppose
        defaultValue: 'support',
      },
    })
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('signatures')
  },
}
