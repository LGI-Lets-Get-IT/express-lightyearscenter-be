'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TargetedBehavior extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TargetedBehavior.init({
    treatmentPlanId: {
      type: DataTypes.INTEGER,
      field: 'treatment_plan_id',
      references: {
        key: 'id',
        model: 'TreatmentPlan',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    targetBehavior: {
      type: DataTypes.TEXT,
      field: 'target_behavior',
    },
    currentAbility: {
      type: DataTypes.TEXT,
      field: 'current_ability',
    },
    shortTermTarget: {
      type: DataTypes.TEXT,
      field: 'short_term_target',
    },
    mediaTools: {
      type: DataTypes.TEXT,
      field: 'media_tools',
    },
  }, {
    sequelize,
    modelName: 'TargetedBehavior',
    tableName: 'targeted_behaviors',
    underscored: true,
  });
  return TargetedBehavior;
};