'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const hashedPassword = await bcrypt.hash('LGIxTLY@2025#', 10)
    await queryInterface.bulkInsert('employees', [
      {
        id: 1,
        role_id: 998,
        full_name: 'LGI Administrator',
        phone_number: '08119000836',
        email: 'dev@itslgit.com',
        password: hashedPassword,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
