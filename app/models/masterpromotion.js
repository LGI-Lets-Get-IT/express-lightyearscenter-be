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
    type: DataTypes.STRING,
    discount_value: DataTypes.INTEGER,
    valid_start_date: DataTypes.DATETIME,
    valid_end_date: DataTypes.DATETIME,
    voucher_code: DataTypes.STRING(16),
    usage_count: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'MasterPromotion',
    tableName: 'master_promotions',
    underscored: true,
  });
  return MasterPromotion;
};