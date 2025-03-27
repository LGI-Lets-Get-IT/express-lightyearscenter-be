'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('treatment_progress', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clientId: {
        field: 'client_id',
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'clients',
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
      treatmentPlanId: {
        field: 'treatment_plan_id',
        references: {
          key: 'id',
          model: 'treatment_plans',
        },
      },
      title: {
        type:  Sequelize.STRING(64),
      },
      currentSession: {
        field: 'current_session',
        type: Sequelize.INTEGER,
      },
      shortTermGoals: {
        field: 'short_term_goals',
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      activities: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      progress: {
        type: Sequelize.ARRAY(Sequelize.STRING)
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
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('treatment_progress');
  }
};