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
        ["appointmentDate", "DESC"],
        ["status", "DESC"],
      ],
      attributes: [
        "id",
        "title",
        "appointmentType",
        "picId",
        "picType",
        "appointmentDate",
        [db.sequelize.col("client.uuid"), "clientId"],
        [db.sequelize.col("client.full_name"), "clientName"],
        [
          db.sequelize.literal(`
            CASE
              WHEN appointment_date > CURRENT_DATE THEN 'Upcoming'
              WHEN appointment_date = CURRENT_DATE AND now() < booking_time_start THEN 'Upcoming'
              WHEN appointment_date = CURRENT_DATE AND now() BETWEEN booking_time_start AND booking_time_end THEN 'Ongoing'
              WHEN appointment_date < CURRENT_DATE OR (appointment_date = CURRENT_DATE AND now() > booking_time_end) THEN 'Done'
              ELSE 'Unknown'
            END 
          `),
          "status", //
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
        "isConfirmed",
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
      nest: true,
      raw: true,
      where: {
        id,
      },
      attributes: [
        "id",
        "title",
        "appointmentType",
        "picId",
        "picType",
        "clientId",
        "roomId",
        "appointmentDate",
        // [
        //   db.sequelize.fn(
        //     "TO_CHAR",
        //     db.sequelize.col("booking_time_start"),
        //     "YYYY-MM-DD"
        //   ),
        //   "appointmentDate",
        // ],
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
              WHEN appointment_date > CURRENT_DATE THEN 'Upcoming'
              WHEN appointment_date = CURRENT_DATE AND now() < booking_time_start THEN 'Upcoming'
              WHEN appointment_date = CURRENT_DATE AND now() BETWEEN booking_time_start AND booking_time_end THEN 'Ongoing'
              WHEN appointment_date < CURRENT_DATE OR (appointment_date = CURRENT_DATE AND now() > booking_time_end) THEN 'Done'
              ELSE 'Unknown'
            END 
          `),
          "status", //
        ],
        "isConfirmed",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: db.clients,
          as: "client",
          attributes: [
            "uuid",
            "fullName",
            // [
            //   db.sequelize.literal(`
            //     date_part('year', age(current_date, "client"."date_of_birth")) || ' years ' ||
            //     date_part('month', age(current_date, "client"."date_of_birth")) || ' months ' ||
            //     date_part('days', age(current_date, "client"."date_of_birth")) || ' days'`),
            //   'age'
            // ],
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

  const bulkCreate = (bodyData, transaction) => {
    return db.appointments.bulkCreate(bodyData, { transaction });
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

  const checkRoomAvailable = async (
    roomId,
    appointmentDate,
    bookingTimeStart,
    bookingTimeEnd
  ) => {
    const isAvailable = await db.appointments.findOne({
      where: {
        roomId,
        appointmentDate,
        bookingTimeStart: {
          [db.Sequelize.Op.lt]: bookingTimeEnd,
        },
        bookingTimeEnd: {
          [db.Sequelize.Op.gt]: bookingTimeStart,
        },
      },
    });

    return !isAvailable;
  };

  const checkPICAvailable = async (
    picId,
    appointmentDate,
    bookingTimeStart,
    bookingTimeEnd
  ) => {
    const isAvailable = await db.appointments.findOne({
      where: {
        picId,
        appointmentDate,
        bookingTimeStart: {
          [db.Sequelize.Op.lt]: bookingTimeEnd,
        },
        bookingTimeEnd: {
          [db.Sequelize.Op.gt]: bookingTimeStart,
        },
      },
    });

    return !isAvailable;
  };

  return {
    findAll,
    findOneById,
    findOneByClientUuid,
    create,
    bulkCreate,
    checkRoomAvailable,
    checkPICAvailable,
    updateById,
    deleteByIds,
  };
}

module.exports = AppointmentRepository;
