"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("appointments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      psychologistId: {
        type: Sequelize.INTEGER,
        field: "psychologist_id",
        references: {
          model: "employees",
          key: "id",
        },
      },
      clientId: {
        type: Sequelize.INTEGER,
        field: "client_id",
        references: {
          model: "clients",
          key: "id",
        },
      },
      title: {
        type: Sequelize.STRING(64),
      },
      appointmentType: {
        type: Sequelize.STRING(32),
        field: 'appointment_type'
      },
      bookingTimeStart: {
        type: Sequelize.DATE,
        field: "booking_time_start",
      },
      bookingTimeEnd: {
        type: Sequelize.DATE,
        field: "booking_time_end",
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
    await queryInterface.dropTable("appointments");
  },
};
