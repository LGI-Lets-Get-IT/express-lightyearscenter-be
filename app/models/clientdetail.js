'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClientDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClientDetail.init({
    clientId: {
      type: DataTypes.INTEGER,
      field: 'client_id',
      allowNull: false,
      references: {
        model: 'Client',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    placeOfBirth: {
      type: DataTypes.STRING(64),
      field: 'place_of_birth',
      allowNull: true
    },
    religion: DataTypes.STRING(32),
    childBirthOrder: {
      type: DataTypes.STRING(32),
      field: 'child_birth_order',
      allowNull: true,
    },
    homeAddress: {
      type: DataTypes.STRING,
      field: 'home_address',
      allowNull: true,
    },
    previousOngoingActivity: {
      type: DataTypes.TEXT,
      field: 'previous_ongoing_activity',
      allowNull: true,
    },
    majorReasonConcerns: {
      type: DataTypes.TEXT,
      field: 'major_reason_concerns',
      allowNull: true,
    },
    previousPsychologicalDetails: {
      type: DataTypes.TEXT,
      field: 'previous_psychological_details',
      allowNull: true,
    },
    programsExpectations: {
      type: DataTypes.TEXT,
      field: 'programs_expectations',
      allowNull: true,
    },
    socialAbilities: {
      type: DataTypes.STRING,
      field: 'social_abilities',
      allowNull: true,
    },
    relationshipAbilities: {
        type: DataTypes.STRING,
        field: 'relationship_abilities',
        allowNull: true,
    },
    healthAbilities: {
      type: DataTypes.STRING,
      field: 'health_abilities',
      allowNull: true,
    },
    mathAbilities: {
      type: DataTypes.STRING,
      field: 'math_abilities',
      allowNull: true,
    },
    howHeardAboutUs: {
      type: DataTypes.STRING,
      field: 'how_heard_about_us',
      allowNull: true,
    },
    institutionsData: {
      type: DataTypes.JSONB,
      field: 'institutions_data',
      allowNull: true,
    },
    guardiansData: {
      type: DataTypes.JSONB,
      field: 'guardians_data',
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'ClientDetail',
    tableName: 'client_details',
    underscored: true,
  });
  return ClientDetail;
};