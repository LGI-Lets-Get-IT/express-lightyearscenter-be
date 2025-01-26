'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasterArea extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterArea.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MasterArea',
    tableName: 'master_areas',
    underscored: true,
  });
  return MasterArea;
};