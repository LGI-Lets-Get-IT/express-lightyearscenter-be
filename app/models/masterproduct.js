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
      // this.belongsTo(models.MasterProductCategory, {
      //   foreignKey: "products_category_id",
      //   key: "id",
      // });
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
      base_price: DataTypes.INTEGER,
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
