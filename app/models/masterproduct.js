"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MasterProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.subProductCategory, {
        foreignKey: 'sub_product_category_id'
      })
    }
  }
  MasterProduct.init(
    {
      sub_product_category_id: DataTypes.INTEGER,
      name: DataTypes.STRING(64),
      description: DataTypes.STRING(128),
      base_price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MasterProduct",
      tableName: "master_products",
      underscored: true,
    }
  );
  return MasterProduct;
};
