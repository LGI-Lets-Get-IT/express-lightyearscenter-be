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
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      psychologistId: {
        type: Sequelize.INTEGER,
        field: 'psychologist_id',
        references: {
          key: 'id',
          model: 'employees',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      clientId: {
        type: Sequelize.INTEGER,
        field: 'client_id',
        references: {
          key: 'id',
          model: 'clients',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      testTypeId: {
        type: Sequelize.INTEGER,
        field: 'test_type_id',
        references: {
          key: 'id',
          model: 'test_types'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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