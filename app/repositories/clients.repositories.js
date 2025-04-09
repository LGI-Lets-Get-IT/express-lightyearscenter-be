function ClientRepository(db) {
  const findAll = () => {
    return db.clients.findAll({});
  };

  const findOneById = (id) => {
    return db.clients.findOne({
      where: {
        id,
      },
    });
  }
  
  const findOneByUuid = (uuid) => {
    return db.clients.findOne({
      subQuery: false,
      where: {
        uuid,
      },
      attributes: [
        'id',
        'uuid',
        'fullName',
        [db.sequelize.fn('TO_CHAR', db.sequelize.col('date_of_birth'), 'DD Mon YYYY'), 'dateOfBirth'],
        'nationality',
        'age',
        'gender',
        'guardianName',
        'guardianNationality',
        'guardianPhone',
        'guardianEmail',
        'guardianRelationship',
        [db.sequelize.col('school.name'), 'schoolName'],
      ],
      include: [
        {
          model: db.schools,
          as: 'school',
          attributes: []
        }
      ]
    });
  };

  const findOneByUuidWithAppointments = (uuid) => {
    return db.clients.findOne({
      subQuery: false,
      where: {
        uuid,
      },
      attributes: [
        'uuid',
        'fullName',
        [db.sequelize.fn('TO_CHAR', db.sequelize.col('date_of_birth'), 'DD Mon YYYY'), 'dateOfBirth'],
        'nationality',
        'age',
        'gender',
        'guardianName',
        'guardianNationality',
        'guardianPhone',
        'guardianEmail',
        'guardianRelationship',
        // [db.sequelize.col('school.id'), 'schoolId'],
        [db.sequelize.col('school.name'), 'schoolName'],
      ],
      include: [
        {
          model: db.appointments,
          as: 'appointments',
          attributes: [
            'id',
            'title',
            'appointmentType',
            [db.sequelize.fn('TO_CHAR', db.sequelize.col('booking_time_start'), 'DD Mon YYYY'), 'appointmentDate'],
            [db.sequelize.fn('CONCAT', db.sequelize.fn('TO_CHAR', db.sequelize.col('booking_time_start'), 'HH24:MI'), ' - ', db.sequelize.fn('TO_CHAR', db.sequelize.col('booking_time_end'), 'HH24:MI')), 'appointmentTime'],
          ]
        },
        {
          model: db.schools,
          as: 'school',
          attributes: []
        }
      ]
    });
  };

  const create = (bodyData, transaction) => {
    return db.clients.create(bodyData, { transaction })
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
    findOneById,
    findOneByUuid,
    findOneByUuidWithAppointments,
    create,
    updateByUuid,
    deleteByUuids,
  };
}

module.exports = ClientRepository;
