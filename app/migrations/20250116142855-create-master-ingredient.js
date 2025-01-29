"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("master_ingredients", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      key: {
        type: Sequelize.STRING(64)
      },
      unit_type: {
        type: Sequelize.ENUM,
        values: ['ml', 'l', 'kg', 'g']
      },
      available_quantity: {
        type: Sequelize.INTEGER,
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "suppliers",
          key: "id",
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("master_ingredients");
  },
};

