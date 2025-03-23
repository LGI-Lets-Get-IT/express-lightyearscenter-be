function ClientRepository(db) {
  const findAll = () => {
    return db.clients.findAll({
    });
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

      where: {
        uuid,
      },
      attributes: [
        'id',
        'uuid',
        'schoolId',
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
      ],
      include: [
        {
          model: db.appointments,
          as: 'appointments',
        }
      ]
    });
  };

  const create = (bodyData, transaction) => {
    return db.clients.create(bodyData, { transaction })
  };

  const updateById = (uuid, bodyData, transaction) => {
    return db.clients.update(bodyData, {
      returning: true,
      raw: true,
      where: {
        uuid: uuid,
      },
    }, { transaction })
  }

  const deleteByIds = (ids, transaction) => {
    return db.clients.destroy({
      where: {
        id: ids
      }
    }, { transaction })
  }

  return {
    findAll,
    findOneById,
    findOneByUuid,
    create,
    updateById,
    deleteByIds,
  };
}

module.exports = ClientRepository;