'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    cashier_id: Sequelize.INTEGER,
    customer_id: Sequelize.INTEGER,
    branch_id: Sequelize.INTEGER,
    promo_id: Sequelize.INTEGER,
    order_number: Sequelize.STRING(32),
    status: Sequelize.STRING(64),
    gross_amount: Sequelize.INTEGER,
    invoice_amount: Sequelize.INTEGER,
    payment_method: Sequelize.STRING,
    created_by: Sequelize.STRING(64),
    updated_by: Sequelize.STRING(64),
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    underscored: true,
  });
  return Order;
};