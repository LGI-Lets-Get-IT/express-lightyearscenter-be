function AppointmentRepository(db) {
  const findAll = () => {
    return db.appointments.findAll({
      attributes: [
        'id',
        [db.sequelize.col('client.full_name'), 'clientName'],
        [db.sequelize.col('psychologist.full_name'), 'psychologistName'],
        'bookingTimeStart',
        'bookingTimeEnd',
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
      }
    });
  };

  const create = (bodyData, transaction) => {
    return db.appointments.create(bodyData, { transaction });
  };

  const update = (id, bodyData, transaction) => {
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

  return {
    findAll,
    findOneById,
    create,
    update,
  };
}

module.exports = AppointmentRepository;
