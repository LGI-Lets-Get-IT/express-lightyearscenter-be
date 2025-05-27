'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clientId: {
        type: Sequelize.INTEGER,
        field: 'client_id',
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      placeOfBirth: {
        type: Sequelize.STRING(64),
        field: 'place_of_birth',
        allowNull: true,
      },
      religion: {
        type: Sequelize.STRING(32),
        allowNull: true,
      },
      childBirthOrder: {
        type: Sequelize.STRING(32),
        field: 'child_birth_order',
        allowNull: true,
      },
      homeAddress: {
        type: Sequelize.STRING,
        field: 'home_address',
        allowNull: true,
      },
      previousOngoingActivity: {
        type: Sequelize.TEXT,
        field: 'previous_ongoing_activity',
        allowNull: true,
      },
      majorReasonConcerns: {
        type: Sequelize.TEXT,
        field: 'major_reason_concerns',
        allowNull: true,
      },
      previousPsychologicalDetails: {
        type: Sequelize.TEXT,
        field: 'previous_psychological_details',
        allowNull: true,
      },
      programsExpectations: {
        type: Sequelize.TEXT,
        field: 'programs_expectations',
        allowNull: true,
      },
      socialAbilities: {
        type: Sequelize.STRING,
        field: 'social_abilities',
        allowNull: true,
      },
      relationshipAbilities: {
        type: Sequelize.STRING,
        field: 'relationship_abilities',
        allowNull: true,
      },
      healthAbilities: {
        type: Sequelize.STRING,
        field: 'health_abilities',
        allowNull: true,
      },
      mathAbilities: {
        type: Sequelize.STRING,
        field: 'math_abilities',
        allowNull: true,
      },
      howHeardAboutUs: {
        type: Sequelize.STRING,
        field: 'how_heard_about_us',
        allowNull: true,
      },
      institutionsData: {
        type: Sequelize.JSONB,
        field: 'institutions_data',
        allowNull: true,
      },
      guardiansData: {
        type: Sequelize.JSONB,
        field: 'guardians_data',
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('client_details');
  }
};