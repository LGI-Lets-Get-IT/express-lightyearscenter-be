'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client_assessments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        field: 'appointment_id',
        references: {
          key: 'id',
          model: 'appointments'
        }
      },
      clientId: {
        type: Sequelize.INTEGER,
        field: 'client_id',
        references: {
          key: 'id',
          model: 'clients',
        },
      },
      testId: {
        type: Sequelize.INTEGER,
        field: 'test_id',
        references: {
          key: 'id',
          model: 'master_tests'
        },
      },
      result: Sequelize.TEXT,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('client_assessments');
  }
};