function AppointmentRepository(db) {
  const findAll = () => {
    return db.appointments.findAll({
      attributes: [
        "id",
        'title',
        [db.sequelize.col("client.uuid"), "clientId"],
        [db.sequelize.col("client.full_name"), "clientName"],
        [db.sequelize.col("psychologist.full_name"), "psychologistName"],
        [db.sequelize.literal(`
            CASE
              WHEN now() < booking_time_start THEN 'Upcoming'
              WHEN now() BETWEEN booking_time_start AND booking_time_end THEN 'Ongoing'
              WHEN now() > booking_time_end THEN 'Done'
              ELSE 'Unknown'
            END 
          `), 'status'//
        ],
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
      ],
    });
  };

  const findOneById = (id) => {
    return db.appointments.findOne({
      where: {
        id,
      },
      attributes: [
        "id",
        "title",
        "appointmentType",
        "createdAt",
        "clientId",
        [db.sequelize.col("psychologist.full_name"), "psychologistName"],
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
          `), 'status'//
        ],
      ],
      include: [
        {
          model: db.clients,
          as: "client",
          attributes: [
            "uuid",
            "fullName",
            "age",
            "gender",
            "dateOfBirth",
            "nationality",
            "guardianName",
            "guardianPhone",
            "guardianNationality",
            "guardianEmail",
            "guardianRelationship",
            "createdAt",
          ],
        },
        {
          model: db.employees,
          as: "psychologist",
          attributes: [],
        },
      ],
    });
  };

  const findOneByClientUuid = (uuid) => {
    return db.appointments.findOne({
      where: {
        clientUuid,
      },
    });
  };

  const create = (bodyData, transaction) => {
    return db.appointments.create(bodyData, { transaction });
  };

  const updateById = (id, bodyData, transaction) => {
    return db.appointments.update(
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
    return db.appointments.destroy(
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
    findOneByClientUuid,
    create,
    updateById,
    deleteByIds,
  };
}

module.exports = AppointmentRepository;
