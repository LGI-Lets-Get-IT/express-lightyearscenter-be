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
      picId: {
        type: Sequelize.INTEGER,
        field: "pic_id",
      },
      picType: {
        type: Sequelize.STRING(64),
        field: 'pic_type',
      },
      clientId: {
        type: Sequelize.INTEGER,
        field: "client_id",
        references: {
          model: "clients",
          key: "id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
