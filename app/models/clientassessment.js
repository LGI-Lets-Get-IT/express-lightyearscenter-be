'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientAssessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.appointments, {
        foreignKey: 'appointmentId',
        as: 'appointment'
      });
      this.belongsTo(models.employees, {
        foreignKey: 'psychologistId',
        as: 'psychologist',
      });
      this.belongsTo(models.clients, {
        foreignKey: 'clientId',
        as: 'client',
      });
      this.belongsTo(models.testTypes, {
        foreignKey: 'testTypeId',
        as: 'testType',
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
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    psychologistId: {
      type: DataTypes.INTEGER,
      field: 'psychologist_id',
      references: {
        key: 'id',
        model: 'Psychologist',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    clientId: {
      type: DataTypes.INTEGER,
      field: 'client_id',
      references: {
        key: 'id',
        model: 'Clients',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    testTypeId: {
      type: DataTypes.INTEGER,
      field: 'test_type_id',
      references: {
        key: 'id',
        model: 'TestType'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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