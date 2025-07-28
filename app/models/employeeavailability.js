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
        foreignKey: "id",
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
      availableTime: {
        type: DataTypes.DATE,
        field: "available_time",
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
