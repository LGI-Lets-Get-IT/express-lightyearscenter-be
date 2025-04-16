"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employees", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roleId: {
        type: Sequelize.INTEGER,
        field: 'role_id',
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      fullName: {
        type: Sequelize.STRING(128),
        field: 'full_name'
      },
      phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
        field: 'phone_number'
      },
      email: {
        type: Sequelize.STRING(128),
        unique: true,
      },
      password: {
        type: Sequelize.STRING
      },
      refreshToken: {
        type: Sequelize.TOKEN,
        field: 'refresh_token'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
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
    await queryInterface.dropTable("employees");
  },
};

