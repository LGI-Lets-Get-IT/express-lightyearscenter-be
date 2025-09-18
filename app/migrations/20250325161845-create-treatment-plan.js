"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("treatment_plans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clientId: {
        type: Sequelize.INTEGER,
        field: "client_id",
        references: {
          model: "clients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      psychologistId: {
        type: Sequelize.INTEGER,
        field: "psychologist_id",
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      presentProblem: {
        type: Sequelize.TEXT,
        field: "present_problem",
      },
      consultDate: {
        type: Sequelize.DATE,
        field: "consult_date",
      },
      parentPlan: {
        type: Sequelize.TEXT,
        field: "parent_plan",
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
    await queryInterface.dropTable("treatment_plans");
  },
};
