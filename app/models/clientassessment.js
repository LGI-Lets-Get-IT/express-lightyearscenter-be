'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientAssessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.appointments, {
        foreignKey: 'id',
        as: 'appointment'
      });
    }
  }
  ClientAssessment.init({
    appointmentId: {
      type: DataTypes.INTEGER,
      field: 'appointment_id',
      references: {
        key: 'id',
        model: 'Appointments'
      },
    },
    clientId: {
      type: DataTypes.INTEGER,
      field: 'client_id',
      references: {
        key: 'id',
        model: 'Clients',
      },
    },
    testTypeId: {
      type: DataTypes.INTEGER,
      field: 'test_type_id',
      references: {
        key: 'id',
        model: 'TestType'
      },
    },
    result: {
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'ClientAssessment',
    tableName: 'client_assessments',
    underscored: true,
  });
  return ClientAssessment;
};