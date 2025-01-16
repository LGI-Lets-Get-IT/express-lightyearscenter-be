'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init({
    full_name: DataTypes.STRING,
    phone_number: DataTypes.STRING(32),
    email: DataTypes.STRING(32),
    points_balance: DataTypes.INTEGER,
    qr_code_data: DataTypes.STRING(128),
    is_active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customer',
    underscored: true,
  });
  return Customer;
};