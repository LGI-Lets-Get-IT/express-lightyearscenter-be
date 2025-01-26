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
        type: Sequelize.ENUM,
        values: ['fixed_price', 'percentage']
      },
      voucher_code: {
        type: Sequelize.STRING
      },
      max_discount: {
        type: Sequelize.INTEGER
      },
      discount_value: {
        type: Sequelize.INTEGER
      },
      min_purchase: {
        type: Sequelize.INTEGER
      },
      usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      valid_start_date: {
        type: Sequelize.DATE
      },
      valid_end_date: {
        type: Sequelize.DATE
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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