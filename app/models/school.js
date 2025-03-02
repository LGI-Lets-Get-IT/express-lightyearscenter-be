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
      // define association here
    }
  }
  School.init(
    {
      name: DataTypes.STRING(128),
      address: DataTypes.STRING,
      phoneNumber: {
        type: DataTypes.STRING(32),
        field: 'phone_number',
      },
      email: DataTypes.STRING(128),
      password: DataTypes.STRING,
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
