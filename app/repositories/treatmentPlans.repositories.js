function TreatmentPlanRepository(db) {
  const findAll = (queryParams) => {
    let whereOptions;
    if (queryParams) {
      whereOptions = queryParams
    }

    return db.treatmentPlans.findAll({
      where: whereOptions,
      group: [
        "TreatmentPlan.id",
        "client.uuid",
        "client.full_name",
        "programs.id",
        "targetedBehaviors.id",
        "psychologist.full_name",
      ],
      attributes: [
        "id",
        [db.sequelize.col("client.uuid"), "clientId"],
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
        // [db.sequelize.literal('CAST(COUNT(targetedBehaviors.id) AS INTEGER)'), 'totalTargetedBehaviors'],
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
        'psychologistId',
        "presentProblem",
        "consultDate",
        "parentPlan",
        'updatedAt',
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
            "uuid",
            "fullName",
            "guardianName",
            "guardianPhone",
            "guardianRelationship",
            "dateOfBirth",
            'problem',
          ],
          include: [
            {
              model: db.schools,
              as: "school",
              attributes: [],
            },
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
          separate: true,
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
              attributes: [],
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

  const deleteById = (id, transaction) => {
    return db.treatmentPlans.destroy(
      {
        where: {
          id,
        },
      },
      { transaction }
    );
  };

  return {
    findAll,
    findOneById,
    findAllByClientId,
    create,
    updateById,
    deleteById,
  };
}

module.exports = TreatmentPlanRepository;
