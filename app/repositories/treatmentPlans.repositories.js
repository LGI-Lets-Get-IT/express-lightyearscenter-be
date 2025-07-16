function TreatmentPlanRepository(db) {
  const findAll = (queryParams) => {
    let whereOptions = {};
    if (queryParams) {
      const { therapistId, ...restParams } = queryParams;
      if (therapistId) {
        whereOptions.treatmentProgram = { therapistId };
      } else {
        whereOptions.treatmentPlans = restParams;
      }
    }

    return db.treatmentPlans.findAll({
      where: whereOptions.treatmentPlans,
      group: [
        "TreatmentPlan.id",
        "client.id",
        "client.uuid",
        "client.full_name",
        "programs.id",
        "targetedBehaviors.id",
        "psychologist.full_name",
      ],
      attributes: [
        "id",
        [db.sequelize.col("client.id"), "clientId"],
        [db.sequelize.col("client.uuid"), "clientUuid"],
        [db.sequelize.col("client.full_name"), "clientName"],
        [db.sequelize.col("psychologist.full_name"), "plannedBy"],
        [
          db.sequelize.fn("COUNT", db.sequelize.col(`targetedBehaviors.id`)),
          "totalTargetedBehaviors",
        ],
        [
          db.sequelize.literal("CAST(COUNT(programs.id) AS INTEGER)"),
          "totalTreatments",
        ],
        "consultDate",
      ],
      include: [
        {
          model: db.clients,
          as: "client",
          attributes: [],
        },
        {
          model: db.employees,
          as: "psychologist",
          attributes: [],
        },
        {
          model: db.treatmentPrograms,
          as: "programs",
          attributes: [],
          where: whereOptions.treatmentProgram,
        },
        {
          model: db.targetedBehaviors,
          as: "targetedBehaviors",
          attributes: [],
        },
      ],
    });
  };

  const findOneById = (id) => {
    return db.treatmentPlans.findOne({
      attributes: [
        "id",
        "clientId",
        "psychologistId",
        "presentProblem",
        "consultDate",
        "parentPlan",
        "updatedAt",
      ],
      where: {
        id,
      },
      include: [
        {
          model: db.employees,
          as: "psychologist",
          attributes: ["id", "fullName"],
        },
        {
          model: db.clients,
          as: "client",
          attributes: [
            "id",
            "uuid",
            "fullName",
            "guardianName",
            "guardianPhone",
            "guardianRelationship",
          ],
          include: [
            {
              model: db.clientAssessments,
              as: "assessments",
              attributes: ["id", "result"],
              include: [
                {
                  model: db.appointments,
                  as: "appointment",
                  attributes: ["bookingTimeStart"],
                },
              ],
            },
          ],
        },
        {
          model: db.treatmentPrograms,
          as: "programs",
          separate: true,
          attributes: [
            "id",
            "aimOfTreatment",
            "sessionFrequency",
            "sessionDuration",
            [db.sequelize.col(`treatmentType.id`), "treatmentId"],
            [db.sequelize.col(`treatmentType.name`), "treatmentName"],
            [db.sequelize.col(`therapist.id`), "therapistId"],
            [db.sequelize.col(`therapist.full_name`), "therapistName"],
          ],
          include: [
            {
              model: db.employees,
              as: "therapist",
              attributes: [],
            },
            {
              model: db.treatmentTypes,
              as: "treatmentType",
              attributes: [],
            },
          ],
        },
        {
          model: db.targetedBehaviors,
          as: "targetedBehaviors",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          order: [["id", "ASC"]],
        },
        {
          model: db.treatmentSessions,
          as: "sessions",
          // separate: true,
          // attributes: [
          //   'id',
          //   'currentSession',
          //   'shortTermGoals',
          //   'activities',
          //   'progress',
          // ],
          include: [
            {
              model: db.appointments,
              as: "appointment",
              attributes: ["id", "title", "appointmentType"],
            },
            {
              model: db.treatmentPrograms,
              as: "program",
              // attributes: [
              //   [db.sequelize.col(`treatmentType.name`), "treatmentName"],
              //   [db.sequelize.col(`therapist.full_name`), "therapistName"],
              // ],
              include: [
                {
                  model: db.treatmentTypes,
                  as: "treatmentType",
                  attributes: ["name"],
                },
                {
                  model: db.employees,
                  as: "therapist",
                  attributes: ["fullName", "phoneNumber", "email"],
                },
              ],
            },
          ],
        },
      ],
    });
  };

  const findAllByClientId = (clientId) => {
    return db.treatmentPlans.findAll({
      where: {
        clientId: clientId,
      },
    });
  };

  const findAllByClientIdWithPrograms = (clientId) => {
    return db.treatmentPlans.findAll({
      where: {
        clientId,
      },
      include: [
        {
          model: db.employees,
          as: "psychologist",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: db.treatmentPrograms,
          as: "programs",
          attributes: ["id"],
          include: [
            {
              model: db.employees,
              as: "therapist",
              attributes: ["id", "full_name", "email"],
            },
          ],
        },
      ],
    });
  };

  const create = (bodyData, transaction) => {
    return db.treatmentPlans.create(bodyData, { transaction });
  };

  const updateById = (id, bodyData, transaction) => {
    return db.treatmentPlans.update(
      bodyData,
      {
        where: {
          id,
        },
      },
      { transaction }
    );
  };

  const deleteByIds = (ids, transaction) => {
    return db.treatmentPlans.destroy(
      {
        where: {
          id: ids,
        },
      },
      { transaction }
    );
  };

  return {
    findAll,
    findOneById,
    findAllByClientId,
    findAllByClientIdWithPrograms,
    create,
    updateById,
    deleteByIds,
  };
}

module.exports = TreatmentPlanRepository;
