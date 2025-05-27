'use strict';

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
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        key: 'STAFF',
        name: 'Staff',
        description: 'Staff Role',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        key: 'PSYCHOLOGIST',
        name: 'Psychologist',
        description: 'Psychologist Role',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        key: 'THERAPIST',
        name: 'Therapist',
        description: 'Therapist Role',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        key: 'SPED_TEACHER',
        name: 'Special Education Teacher',
        description: 'SPED Teacher Role',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        key: 'SCHOOL_PIC',
        name: 'School PIC',
        description: 'School PIC Role',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 998,
        key: 'SUPER_ADMIN',
        name: 'Super Admin',
        description: 'Super Admin Role',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('roles', null)
  }
};
