function ClientRepository(db) {
  const findAll = () => {
    return db.clientAssessments.findAll({
      attributes: [
        'id',
        [db.sequelize.col(`client.uuid`), 'clientId'],
        [db.sequelize.col(`client.full_name`), 'clientName'],
        [db.sequelize.col(`appointment.psychologist.full_name`), 'assessedBy'],
        [db.sequelize.col(`testType.name`), 'testName'],
        [db.sequelize.fn('TO_CHAR', db.sequelize.col(
          'appointment.booking_time_start'), 'DD Mon YYYY'),
          'assessmentDate'
        ],
      ],
      include: [
        {
          model: db.appointments,
          as: 'appointment',
          attributes: [],
          include: [
            {
              model: db.employees,
              as: 'psychologist',
              attributes: []
            }
          ]
        },
        {
          model: db.clients,
          as: 'client',
          attributes: [],
        },
        {
          model: db.testTypes,
          as: 'testType',
          attributes: [],
        },
      ]
    });
  };

  const findOneById = (id) => {
    return db.clientAssessments.findOne({
      where: {
        id,
      },
    });
  }

  const create = (bodyData, transaction) => {
    console.log('BODYDATAAA', bodyData)
    return db.clientAssessments.create(bodyData, { transaction })
  };

  const updateById = (id, bodyData, transaction) => {
    return db.clientAssessments.update(
      bodyData,
      {
        returning: true,
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
          ids,
        },
      },
      { transaction }
    );
  };

  return {
    findAll,
    findOneById,
    create,
    updateById,
    deleteByIds,
  };
}

module.exports = ClientRepository;
