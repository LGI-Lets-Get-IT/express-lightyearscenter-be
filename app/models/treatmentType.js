'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TreatmentType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TreatmentType.init({
    name: DataTypes.STRING(128),
    description: DataTypes.TEXT,
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'TreatmentType',
    tableName: 'treatment_types',
    underscored: true,
  });
  return TreatmentType;
};