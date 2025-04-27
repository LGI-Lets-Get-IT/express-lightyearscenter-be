'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TreatmentPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.clients, {
        foreignKey: 'clientId',
        as: 'client',
      });
      this.belongsTo(models.employees, {
        foreignKey: 'psychologistId',
        as: 'psychologist',
      });
      this.hasMany(models.treatmentSessions, {
        foreignKey: 'treatmentPlanId',
        as: 'sessions',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.targetedBehaviors, {
        foreignKey: 'treatmentPlanId',
        as: 'targetedBehaviors',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.treatmentPrograms, {
        foreignKey: 'treatmentPlanId',
        as: 'programs',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      })
    }
  }
  TreatmentPlan.init({
    clientId: {
      type: DataTypes.INTEGER,
      field: 'client_id',
      references: {
        model: 'Client',
        key: 'id',
      },
    },
    psychologistId: {
      type: DataTypes.INTEGER,
      field: 'psychologist_id',
      references: {
        model: 'Employee',
        key: 'id',
      },
    },
    presentProblem: {
      type: DataTypes.TEXT,
      field: 'present_problem',
    },
    consultDate: {
      type: DataTypes.DATE,
      field: 'consult_date',
    },
    parentPlan: {
      type: DataTypes.TEXT,
      field: 'parent_plan',
    },
  }, {
    sequelize,
    modelName: 'TreatmentPlan',
    tableName: 'treatment_plans',
    underscored: true,
  });
  return TreatmentPlan;
};