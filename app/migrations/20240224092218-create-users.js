"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      full_name: {
        type: Sequelize.STRING(64),
      },
      username: {
        type: Sequelize.STRING(32),
        unique: true,
      },
      phone_number: {
        type: Sequelize.STRING(20),
        unique: true,
      },
      email: {
        type: Sequelize.STRING(64),
        unique: true,
      },
      password: Sequelize.STRING,
      active_flag: Sequelize.BOOLEAN,
      refresh_token: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
