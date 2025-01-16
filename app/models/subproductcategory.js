"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubProductCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.masterProductCategory, {
        foreignKey: "product_category_id",
      });
    }
  }
  SubProductCategory.init(
    {
      product_category_id: DataTypes.INTEGER,
      name: DataTypes.STRING(64),
      description: DataTypes.STRING(128),
    },
    {
      sequelize,
      modelName: "SubProductCategory",
      tableName: "sub_product_categories",
      underscored: true,
    }
  );
  return SubProductCategory;
};
