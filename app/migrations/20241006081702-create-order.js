'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cashier_id: {
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      branch_id: {
        type: Sequelize.INTEGER
      },
      promo_id: {
        type: Sequelize.INTEGER
      },
      order_number: {
        type: Sequelize.STRING(32)
      },
      status: {
        type: Sequelize.STRING(64)
      },
      gross_amount: {
        type: Sequelize.INTEGER
      },
      invoice_amount: {
        type: Sequelize.INTEGER
      },
      payment_method: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.STRING(64)
      },
      updated_by: {
        type: Sequelize.STRING(64)
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
    await queryInterface.dropTable('orders');
  }
};