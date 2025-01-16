'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BranchProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BranchProduct.init({
    branch_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    base_price: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'BranchProduct',
    tableName: 'branch_products',
    underscored: true,
  });
  return BranchProduct;
};