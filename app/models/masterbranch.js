'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasterBranch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterBranch.init({
    manager_id: DataTypes.INTEGER,
    name: DataTypes.STRING(64),
    address: DataTypes.STRING(128),
    latitude: DataTypes.STRING(32),
    longitude: DataTypes.STRING(32),
    gmaps_url: DataTypes.STRING(64),
    phone_number: DataTypes.STRING(32),
    operational_time: DataTypes.STRING(32),
    pickup_flag: DataTypes.BOOLEAN,
    dinein_flag: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'MasterBranch',
    tableName: 'master_branches',
    underscored: true,
  });
  return MasterBranch;
};