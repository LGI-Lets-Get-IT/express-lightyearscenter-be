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
      // define association here
      this.belongsTo(models.productCategories, {
        foreignKey: 'product_category_id',
        as: 'category'
      })
    }
  }
  MasterProduct.init(
    {
      product_category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "MasterProductCategory",
          key: 'id',
        }
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      ingredients: DataTypes.JSON,
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
