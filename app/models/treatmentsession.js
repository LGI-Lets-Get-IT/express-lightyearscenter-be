"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TreatmentSession extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.appointments, {
        foreignKey: "appointmentId",
        as: "appointment",
      });
      this.belongsTo(models.clients, {
        foreignKey: "clientId",
        as: "client",
      });
      this.belongsTo(models.treatmentPlans, {
        foreignKey: "treatmentPlanId",
        as: "treatmentPlan",
      });
      this.belongsTo(models.treatmentPrograms, {
        foreignKey: "treatmentProgramId",
        as: "program",
      });
    }
  }
  TreatmentSession.init(
    {
      treatmentPlanId: {
        field: "treatment_plan_id",
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "TreatmentPlan",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      treatmentProgramId: {
        field: "treatment_program_id",
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "TreatmentProgram",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      appointmentId: {
        field: "appointment_id",
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Appointment",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      clientId: {
        field: "client_id",
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Client",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // therapistId: {
      //   field: 'therapist_id',
      //   type: DataTypes.INTEGER,
      //   references: {
      //     key: 'id',
      //     model: 'Employee',
      //   },
      // },
      // treatmentTypeId: {
      //   field: 'treatment_type_id',
      //   type: DataTypes.INTEGER,
      //   references: {
      //     key: 'id',
      //     model: 'TreatmentType',
      //   },
      // },
      // title: DataTypes.STRING(64),
      currentSession: {
        field: "current_session",
        type: DataTypes.INTEGER,
      },
      shortTermGoals: {
        field: "short_term_goals",
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      activities: DataTypes.ARRAY(DataTypes.STRING),
      progress: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "TreatmentSession",
      tableName: "treatment_sessions",
      underscored: true,
    }
  );
  return TreatmentSession;
};
