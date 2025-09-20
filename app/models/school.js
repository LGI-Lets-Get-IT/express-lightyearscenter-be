"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.clients, {
        foreignKey: "school_id",
        as: "clients",
      });
      this.hasMany(models.employees, {
        foreignKey: "school_id",
        as: "pic",
      });
    }
  }
  School.init(
    {
      name: DataTypes.STRING(128),
      address: DataTypes.STRING,
      phoneNumber: {
        type: DataTypes.STRING(32),
        field: "phone_number",
      },
      email: DataTypes.STRING(128),
      picFullName: {
        type: DataTypes.STRING(128),
        field: "pic_full_name",
      },
      picPhoneNumber: {
        type: DataTypes.STRING(32),
        field: "pic_phone_number",
      },
      picEmail: {
        type: DataTypes.STRING(128),
        field: "pic_email",
      },
      password: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        field: "is_active",
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "School",
      tableName: "schools",
      underscored: true,
    }
  );
  return School;
};
