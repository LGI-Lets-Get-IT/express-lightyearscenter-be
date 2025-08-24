function ClientRepository(db) {
  const findAll = () => {
    return db.clients.findAll({});
  };

  const findAllById = (clientIds) => {
    return db.clients.findAll({
      where: {
        id: [clientIds],
      },
    });
  };

  const findOneById = (id) => {
    return db.clients.findOne({
      where: {
        id,
      },
    });
  };

  const findOneByUuid = (uuid) => {
    return db.clients.findOne({
      subQuery: false,
      where: {
        uuid,
      },
      attributes: [
        "id",
        "uuid",
        "fullName",
        "dateOfBirth",
        "nationality",
        "gender",
        "className",
        "problem",
        "guardianName",
        "guardianNationality",
        "guardianPhone",
        "guardianEmail",
        "guardianRelationship",
        [db.sequelize.col("school.name"), "schoolName"],
        "allowShareData",
        "updatedAt",
      ],
      include: [
        {
          model: db.clientDetails,
          as: "clientDetails",
        },
        {
          model: db.schools,
          as: "school",
          attributes: [],
        },
      ],
    });
  };

  const findOneByUuidWithAppointments = (uuid) => {
    return db.clients.findOne({
      subQuery: false,
      where: {
        uuid,
      },
      attributes: [
        "uuid",
        "fullName",
        "dateOfBirth",
        // [db.sequelize.fn('TO_CHAR', db.sequelize.col('date_of_birth'), 'DD Mon YYYY'), 'dateOfBirth'],
        "nationality",
        "gender",
        "className",
        "problem",
        "intakeFormLink",
        "guardianName",
        "guardianNationality",
        "guardianPhone",
        "guardianEmail",
        "guardianRelationship",
        // [db.sequelize.col('school.id'), 'schoolId'],
        [db.sequelize.col("school.id"), "schoolId"],
        [db.sequelize.col("school.name"), "schoolName"],
        "updatedAt",
      ],
      include: [
        {
          model: db.appointments,
          as: "appointments",
          separate: true,
          order: [
            ["appointmentDate", "DESC"],
            ["status", "DESC"],
          ],
          attributes: [
            "id",
            "title",
            "appointmentType",
            [
              db.sequelize.fn(
                "TO_CHAR",
                db.sequelize.col("booking_time_start"),
                "DD Mon YYYY"
              ),
              "appointmentDate",
            ],
            [
              db.sequelize.fn(
                "CONCAT",
                db.sequelize.fn(
                  "TO_CHAR",
                  db.sequelize.col("booking_time_start"),
                  "HH24:MI"
                ),
                " - ",
                db.sequelize.fn(
                  "TO_CHAR",
                  db.sequelize.col("booking_time_end"),
                  "HH24:MI"
                )
              ),
              "appointmentTime",
            ],
            [
              db.sequelize.literal(`
              CASE
                WHEN now() < booking_time_start THEN 'Upcoming'
                WHEN now() BETWEEN booking_time_start AND booking_time_end THEN 'Ongoing'
                WHEN now() > booking_time_end THEN 'Done'
                ELSE 'Unknown'
              END 
            `),
              "status",
            ],
          ],
        },
        {
          model: db.schools,
          as: "school",
          attributes: [],
        },
        // {
        //   model: db.clientDetails,
        //   as: 'clientDetails',
        // }
        {
          model: db.clientAssessments,
          as: "assessments",
          attributes: ["id"],
        },
        {
          model: db.treatmentPlans,
          as: "treatmentPlans",
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: db.employees,
              as: "psychologist",
              attributes: ["id", "fullName"],
            },
            {
              model: db.treatmentPrograms,
              as: "programs",
              include: [
                {
                  model: db.employees,
                  as: "therapist",
                  attributes: ["id", "fullName"],
                },
              ],
            },
          ],
        },
      ],
    });
  };

  const findOneByEmail = (email) => {
    return db.clients.findOne({
      // raw: true,
      where: {
        guardianEmail: email,
      },
    });
  };

  const findOneByRefreshToken = (token) => {
    return db.clients.findOne({
      // raw: true,
      where: {
        refreshToken: token,
      },
    });
  };

  const create = (bodyData, transaction) => {
    return db.clients.create(bodyData, { transaction });
  };

  const updateByUuid = (uuid, bodyData, transaction) => {
    return db.clients.update(
      bodyData,
      {
        returning: true,
        raw: true,
        where: {
          uuid: uuid,
        },
      },
      { transaction }
    );
  };

  const deleteByUuids = (ids, transaction) => {
    return db.clients.destroy(
      {
        where: {
          uuid: ids,
        },
      },
      { transaction }
    );
  };

  return {
    findAll,
    findAllById,
    findOneById,
    findOneByUuid,
    findOneByUuidWithAppointments,
    findOneByEmail,
    findOneByRefreshToken,
    create,
    updateByUuid,
    deleteByUuids,
  };
}

module.exports = ClientRepository;
