'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('treatment_plan_treatments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      treatmentPlanId: {
        field: 'treatment_plan_id',
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'treatment_plans',
        },
      },
      treatmentTypeId: {
        field: 'treatment_type_id',
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'treatment_types',
        },
      },
      therapistId: {
        field: 'therapist_id',
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'employees',
        },
      },
      aimOfTreatment: {
        field: 'aim_of_treatment',
        type: Sequelize.TEXT,
      },
      sessionFrequency: {
        field: 'session_frequency',
        type: Sequelize.INTEGER,
      },
      sessionDuration: {
        field: 'session_duration',
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('treatment_plan_treatments');
  }
};