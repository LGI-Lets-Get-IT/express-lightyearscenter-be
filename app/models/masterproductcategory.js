"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MasterProductCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterProductCategory.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING(128),
      order: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MasterProductCategory",
      tableName: "master_product_categories",
      underscored: true,
    }
  );
  return MasterProductCategory;
};
