'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasterPromotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterPromotion.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    voucher_code: DataTypes.STRING,
    max_discount: DataTypes.INTEGER,
    discount_value: DataTypes.INTEGER,
    min_purchase: DataTypes.INTEGER,
    valid_start_date: DataTypes.DATE,
    valid_end_date: DataTypes.DATE,
    type: {
      type: DataTypes.ENUM,
      values: ['fixed_price', 'percentage']
    },
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'MasterPromotion',
    tableName: 'master_promotions',
    underscored: true,
  });
  return MasterPromotion;
};