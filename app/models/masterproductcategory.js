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
      this.hasMany(models.subProductCategory, {
        foreignKey: "product_category_id",
      });
    }
  }
  MasterProductCategory.init(
    {
      name: DataTypes.STRING(64),
      icon: DataTypes.STRING(32),
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
