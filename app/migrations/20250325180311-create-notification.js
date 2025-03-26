'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      notifiedUserId: {
        type: Sequelize.INTEGER,
        field: 'notified_user_id',
      },
      message: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      isMarkRead: {
        type: Sequelize.BOOLEAN,
        field: 'is_mark_read',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};