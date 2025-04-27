"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.employees, {
        foreignKey: "psychologistId",
        as: "psychologist",
      });
      this.belongsTo(models.clients, {
        foreignKey: "clientId",
        as: "client",
      });
      this.hasMany(models.clientAssessments, {
        foreignKey: 'appointmentId',
        as: 'assessments'
      })
    }
  }
  Appointment.init(
    {
      psychologistId: {
        type: DataTypes.INTEGER,
        field: "psychologist_id",
        references: {
          model: "Employee",
          key: "id",
        },
      },
      clientId: {
        type: DataTypes.INTEGER,
        field: "client_id",
        references: {
          model: "Client",
          key: "id",
        },
      },
      title: DataTypes.STRING(64),
      appointmentType: {
        type: DataTypes.STRING(32),
        field: "appointment_type",
      },
      bookingTimeStart: {
        type: DataTypes.DATE,
        field: "booking_time_start",
      },
      bookingTimeEnd: {
        type: DataTypes.DATE,
        field: "booking_time_end",
      },
    },
    {
      sequelize,
      modelName: "Appointment",
      tableName: "appointments",
      underscored: true,
    }
  );
  return Appointment;
};
