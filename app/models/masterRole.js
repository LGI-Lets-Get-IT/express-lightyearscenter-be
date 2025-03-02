'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasterRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterRole.init({
    name: DataTypes.STRING(64),
    description: DataTypes.STRING(128),
  }, {
    sequelize,
    modelName: 'MasterRole',
    tableName: 'master_roles',
    underscored: true,
  });
  return MasterRole;
};