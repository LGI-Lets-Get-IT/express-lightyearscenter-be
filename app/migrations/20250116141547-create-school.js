'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schools', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(128)
      },
      address: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING(32),
        field: 'phone_number',
      },
      email: {
        type: Sequelize.STRING(128)
      },
      picFullName: {
        type: Sequelize.STRING(128),
        field: 'pic_full_name',
      },
      picPhoneNumber: {
        type: Sequelize.STRING(32),
        field: 'pic_phone_number',
      },
      picEmail: {
        type: Sequelize.STRING(128),
        field: 'pic_email',
      },
      password: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        field: 'is_active',
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
        
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('schools');
  }
};