'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('targeted_behaviors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      treatmentPlanId: {
        type: Sequelize.INTEGER,
        field: 'treatment_plan_id',
        references: {
          key: 'id',
          model: 'treatment_plans',
        },
      },
      targetBehavior: {
        type: Sequelize.TEXT,
        field: 'target_behavior',
      },
      currentAbility: {
        type: Sequelize.TEXT,
        field: 'current_ability',
      },
      shortTermTarget: {
        type: Sequelize.TEXT,
        field: 'short_term_target',
      },
      longTermTarget: {
        type: Sequelize.TEXT,
        field: 'long_term_target',
      },
      mediaTools: {
        type: Sequelize.TEXT,
        field: 'media_tools',
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
    await queryInterface.dropTable('targeted_behaviors');
  }
};