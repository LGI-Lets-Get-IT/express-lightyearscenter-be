function AppointmentRepository(db) {
  const findAll = () => {
    return db.appointments.findAll({
      attributes: [
        'id',
        [db.sequelize.col('client.uuid'), 'clientId'],
        [db.sequelize.col('client.full_name'), 'clientName'],
        [db.sequelize.col('psychologist.full_name'), 'psychologistName'],
        [db.sequelize.fn('TO_CHAR', db.sequelize.col('booking_time_start'), 'DD Mon YYYY'), 'appointmentDate'],
        [db.sequelize.fn('CONCAT', db.sequelize.fn('TO_CHAR', db.sequelize.col('booking_time_start'), 'HH24:MI'), ' - ', db.sequelize.fn('TO_CHAR', db.sequelize.col('booking_time_end'), 'HH24:MI')), 'appointmentTime'],
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
      include: [
        {
          model: db.clients,
          as: 'client',
        },
        {
          model: db.employees,
          as: 'psychologist',
        }
      ]
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
    return db.appointments.destroy({
      where: {
        id: ids,
      },
    }, { transaction });
  }

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
