'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TreatmentProgram extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.treatmentPlans, {
        foreignKey: 'id',
        as: 'treatmentPlan',
      });
      this.belongsTo(models.treatmentTypes, {
        foreignKey: 'treatmentTypeId',
        as: 'treatmentType',
      });
      this.belongsTo(models.employees, {
        foreignKey: 'therapistId',
        as: 'therapist',
      });
    }
  }
  TreatmentProgram.init({
    treatmentPlanId: {
      field: 'treatment_plan_id',
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'TreatmentPlan'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    treatmentTypeId: {
      field: 'treatment_type_id',
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'TreatmentType',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    therapistId: {
      field: 'therapist_id',
      type: DataTypes.INTEGER,
      references: {
        key: 'id',
        model: 'Employee',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
    modelName: 'TreatmentProgram',
    tableName: 'treatment_programs',
    underscored: true,
  });
  return TreatmentProgram;
};