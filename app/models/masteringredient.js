"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MasterIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterIngredient.init(
    {
      name: DataTypes.STRING,
      unit_type: DataTypes.STRING,
      available_qty: DataTypes.INTEGER,
      supplier_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MasterIngredient",
    }
  );
  return MasterIngredient;
};
