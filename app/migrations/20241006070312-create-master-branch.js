'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('master_branches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      manager_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(64)
      },
      address: {
        type: Sequelize.STRING(128)
      },
      latitude: {
        type: Sequelize.STRING(32)
      },
      longitude: {
        type: Sequelize.STRING(32)
      },
      gmaps_url: {
        type: Sequelize.STRING(64)
      },
      phone_number: {
        type: Sequelize.STRING(32)
      },
      operational_time: {
        type: Sequelize.STRING(32)
      },
      pickup_flag: {
        type: Sequelize.BOOLEAN
      },
      dinein_flag: {
        type: Sequelize.BOOLEAN
      },
      is_active: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('master_branches');
  }
};