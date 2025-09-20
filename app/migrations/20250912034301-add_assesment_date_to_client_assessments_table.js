"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("client_assessments", "assessment_date", {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("client_assessments", "assessment_date", {
      type: Sequelize.DATE,
    });
  },
};
