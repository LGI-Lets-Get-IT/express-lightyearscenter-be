function ClientRepository(db) {
  const findAll = () => {
    return db.clientAssessments.findAll({
      raw: true,
      attributes: [
        "id",
        [db.sequelize.col(`client.uuid`), "clientId"],
        [db.sequelize.col(`client.full_name`), "clientName"],
        [db.sequelize.col(`psychologist.full_name`), "assessedBy"],
        [db.sequelize.col(`testType.name`), "testName"],
        ["created_at", "assessmentDate"],
        // [
        //   db.sequelize.fn(
        //     "TO_CHAR",
        //     db.sequelize.col("clientAssessment.created_at"),
        //     "DD Mon YYYY"
        //   ),
        //   "assessmentDate",
        // ],
      ],
      include: [
        {
          model: db.appointments,
          as: "appointment",
          attributes: [],
        },
        {
          model: db.employees,
          as: "psychologist",
          attributes: [],
        },
        {
          model: db.clients,
          as: "client",
          attributes: [],
        },
        {
          model: db.testTypes,
          as: "testType",
          attributes: [],
        },
      ],
    });
  };

  const findOneById = (id) => {
    return db.clientAssessments.findOne({
      where: {
        id,
      },
      attributes: ["id", "result", "createdAt", "updatedAt"],
      include: [
        {
          model: db.clients,
          as: "client",
          attributes: ["id", "fullName"],
        },
        {
          model: db.employees,
          as: "psychologist",
          attributes: ["id", "fullName"],
        },
        {
          model: db.testTypes,
          as: "testType",
          attributes: ["id", "name"],
        },
        {
          model: db.appointments,
          as: "appointment",
          attributes: ["id", "title", "appointmentType"],
        },
      ],
    });
  };

  const findAllByAppointmentId = (appointmentId) => {
    return db.clientAssessments.findAll({
      attributes: [
        "id",
        [db.sequelize.col(`testType.name`), "testName"],
        [db.sequelize.col(`psychologist.full_name`), "assessedBy"],
        ["created_at", "assessmentDate"],
        // [db.sequelize.col(`ClientAssessment.created_at`), "assessmentDate"],
        "result",
      ],
      where: {
        appointment_id: appointmentId,
      },
      include: [
        {
          model: db.employees,
          as: "psychologist",
          attributes: [],
        },
        {
          model: db.testTypes,
          as: "testType",
          attributes: [],
        },
      ],
    });
  };

  const create = (bodyData, transaction) => {
    return db.clientAssessments.create(bodyData, { transaction });
  };

  const updateById = (id, bodyData, transaction) => {
    return db.clientAssessments.update(
      bodyData,
      {
        raw: true,
        where: {
          id,
        },
      },
      { transaction }
    );
  };

  const deleteByIds = (ids, transaction) => {
    return db.clientAssessments.destroy(
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
    findAllByAppointmentId,
    create,
    updateById,
    deleteByIds,
  };
}

module.exports = ClientRepository;
