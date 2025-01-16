'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('master_promotions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      discount_value: {
        type: Sequelize.INTEGER
      },
      valid_start_date: {
        type: Sequelize.DATETIME,
      },
      valid_end_date: {
        type: Sequelize.DATETIME
      },
      voucher_code: {
        type: Sequelize.STRING(16)
      },
      usage_count: {
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('master_promotions');
  }
};