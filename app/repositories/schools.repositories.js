function SchoolRepository(db) {
  const findAll = () => {
    return db.schools.findAll();
  };
  
  const findOneById = (id) => {
    console.log('ID', id)
    return db.schools.findByPk(id);
  };

  const findClientsBySchoolId = (id) => {
    return db.schools.findOne({
      attributes: [
        'id',
        'name',
      ],
      where: {
        id
      },
      include: [
        {
          model: db.clients,
          as: "clients",
          attributes: ['uuid', 'fullName', 'guardianName', 'guardianEmail', 'guardianPhone']
        },
      ],
    })
  }

  const findOneSchoolByIdWithClients = (id) => {
    return db.schools.findOne({
      include: [
        {
          model: db.clients,
          as: "clients",
          attributes: ['uuid', 'fullName', 'guardianName', 'guardianEmail', 'guardianPhone']
        },
      ]
    })
  }

  const create = (bodyData, transaction) => {
    return db.schools.create(bodyData, { transaction })
  }

  const updateById = (id, bodyData, transaction) => {
    console.log('bodyData IN REPO', bodyData)
    return db.schools.update(bodyData, {
      where: {
        id
      },
    }, { transaction })
  }

  return {
    findAll,
    findOneById,
    findOneSchoolByIdWithClients,
    findClientsBySchoolId,
    create,
    updateById,
  };
}

module.exports = SchoolRepository;