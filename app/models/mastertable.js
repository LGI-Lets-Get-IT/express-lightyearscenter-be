'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasterTable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterTable.init({
    area_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'master_areas',
        key: 'id'
      }
    },
    table_number: {
      type: DataTypes.STRING,
      unique: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
      values: ['occupied', 'available']
    },
  }, {
    sequelize,
    modelName: 'MasterTable',
    tableName: 'master_tables'
  });
  return MasterTable;
};