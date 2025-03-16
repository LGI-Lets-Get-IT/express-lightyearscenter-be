"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("clients", {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      schoolId: {
        type: Sequelize.INTEGER,
        field: "school_id",
        references: {
          model: "schools",
          key: "id",
        },
      },
      fullName: {
        type: Sequelize.STRING(128),
        field: "full_name",
      },
      age: {
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ["Male", "Female"],
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        field: "date_of_birth",
      },
      nationality: {
        type: Sequelize.STRING(32),
      },
      guardianName: {
        type: Sequelize.STRING(128),
        field: "guardian_name",
      },
      guardianEmail: {
        type: Sequelize.STRING(128),
        unique: true,
        field: "guardian_email",
      },
      guardianPhone: {
        type: Sequelize.STRING(32),
        field: "guardian_phone",
      },
      guardianNationality: {
        type: Sequelize.STRING(32),
        field: 'guardian_nationality'
      },
      guardianRelationship: {
        type: Sequelize.STRING(16),
        field: "guardian_relationship",
      },
      address: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      refreshToken: {
        type: Sequelize.STRING,
        field: "refresh_token",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updated_at",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("clients");
  },
};
