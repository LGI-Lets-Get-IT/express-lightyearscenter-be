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
        foreignKey: 'id',
        as: 'client',
      });
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