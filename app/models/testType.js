'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TestType.init({
    name: DataTypes.STRING(128),
    description: DataTypes.TEXT,
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'TestType',
    tableName: 'test_types',
    underscored: true,
  });
  return TestType;
};