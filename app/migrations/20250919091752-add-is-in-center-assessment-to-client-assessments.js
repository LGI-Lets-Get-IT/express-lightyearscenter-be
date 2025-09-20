"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "client_assessments",
      "is_in_center_assessment",
      {
        type: Sequelize.BOOLEAN,
        field: "is_in_center_assessments",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "client_assessments",
      "is_in_center_assessment"
    );
  },
};
