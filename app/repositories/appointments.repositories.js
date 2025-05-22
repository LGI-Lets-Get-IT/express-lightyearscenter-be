function AppointmentRepository(db) {
  const findAll = (queryParams) => {
    let whereOptions;
    if (queryParams) {
      whereOptions = queryParams;
    }
    return db.appointments.findAll({
      raw: true,
      where: whereOptions,
      order: [
        ['appointmentDate', 'DESC'],
        ['status', 'DESC'],
      ],
      attributes: [
        "id",
        'title',
        'appointmentType',
        'picId',
        'picType',
        [db.sequelize.col("client.uuid"), "clientId"],
        [db.sequelize.col("client.full_name"), "clientName"],
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
        'picId',
        'picType',
        "clientId",
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
        "createdAt",
        'updatedAt',
      ],
      include: [
        {
          model: db.clients,
          as: "client",
          attributes: [
            "uuid",
            "fullName",
            [
              db.sequelize.literal(`
                date_part('year', age(current_date, "client"."date_of_birth")) || ' years ' ||
                date_part('month', age(current_date, "client"."date_of_birth")) || ' months ' ||
                date_part('days', age(current_date, "client"."date_of_birth")) || ' days'`),
              'age'
            ],
            "gender",
            "dateOfBirth",
            "nationality",
            "guardianName",
            "guardianPhone",
            "guardianNationality",
            "guardianEmail",
            "guardianRelationship",
          ],
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
