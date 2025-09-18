"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pic_availabilities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employeeId: {
        type: Sequelize.INTEGER,
        field: "employee_id",
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      availableDays: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        field: "available_days",
      },
      availableStartTime: {
        type: Sequelize.STRING(16),
        field: "available_start_time",
      },
      availableEndTime: {
        type: Sequelize.STRING(16),
        field: "available_end_time",
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
    await queryInterface.dropTable("pic_availabilities");
  },
};
