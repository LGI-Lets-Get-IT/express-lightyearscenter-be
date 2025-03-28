'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TreatmentPlanTreatment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TreatmentPlanTreatment.init({
    treatmentPlanId: {
      field: 'treatment_plan_id',
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'TreatmentPlan'
      }
    },
    treatmentTypeId: {
      field: 'treatment_type_id',
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'TreatmentType',
      },
    },
    therapistId: {
      field: 'therapist_id',
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Employee',
      },
    },
    aimOfTreatment: {
      field: 'aim_of_treatment',
      type: DataTypes.TEXT,
    },
    sessionFrequency: {
      field: 'session_frequency',
      type: DataTypes.INTEGER,
    },
    sessionDuration: {
      field: 'session_duration',
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'TreatmentPlanTreatment',
    tableName: 'treatment_plan_treatments',
    underscored: true,
  });
  return TreatmentPlanTreatment;
};