"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PICAvailability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.employees, {
        foreignKey: "employeeId",
        as: "employee",
      });
    }
  }
  PICAvailability.init(
    {
      employeeId: {
        type: DataTypes.INTEGER,
        field: "employee_id",
        references: {
          model: "Employee",
          key: "id",
        },
      },
      availableDays: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        field: "available_days",
      },
      availableStartTime: {
        type: DataTypes.STRING(16),
        field: "available_start_time",
      },
      availableEndTime: {
        type: DataTypes.STRING(16),
        field: "available_end_time",
      },
    },
    {
      sequelize,
      modelName: "PICAvailability",
      tableName: "pic_availabilities",
      underscored: true,
    }
  );
  return PICAvailability;
};
