"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.roles, {
        foreignKey: "role_id",
        as: "role",
      });
      this.belongsTo(models.schools, {
        foreignKey: "school_id",
        as: "school",
      });
      this.hasMany(models.picAvailabilities, {
        foreignKey: "employee_id",
        as: "schedules",
      });
    }
  }
  Employee.init(
    {
      roleId: {
        type: DataTypes.INTEGER,
        field: "role_id",
        references: {
          model: "Role",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      schoolId: {
        type: DataTypes.INTEGER,
        field: "school_id",
        allowNull: true,
        references: {
          model: "School",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fullName: {
        type: DataTypes.STRING(128),
        field: "full_name",
      },
      phoneNumber: {
        type: DataTypes.STRING(32),
        unique: true,
        field: "phone_number",
      },
      email: {
        type: DataTypes.STRING(128),
        unique: true,
      },
      password: DataTypes.STRING,
      refreshToken: {
        type: DataTypes.TEXT,
        field: "refresh_token",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        field: "is_active",
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Employee",
      tableName: "employees",
      underscored: true,
    }
  );
  return Employee;
};
