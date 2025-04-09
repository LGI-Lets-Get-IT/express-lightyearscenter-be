'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TreatmentProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TreatmentProgress.init({
    appointmentId: {
      field: 'appointment_id',
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Appointment',
      },
    },
    clientId: {
      field: 'client_id',
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Client',
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
    treatmentPlanId: {
      field: 'treatment_plan_id',
      references: {
        key: 'id',
        model: 'TreatmentPlan',
      },
    },
    title: DataTypes.STRING(64),
    currentSession: {
      field: 'current_session',
      type: DataTypes.INTEGER,
    },
    shortTermGoals: {
      field: 'short_term_goals',
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    activities: DataTypes.ARRAY(DataTypes.STRING),
    progress: DaataTypes.ARRAY(DataTypes.STRING),
  }, {
    sequelize,
    modelName: 'TreatmentProgress',
    tableName: 'treatment_progress',
    underscored: true,
  });
  return TreatmentProgress;
};