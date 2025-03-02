function SchoolRepository(db) {
  const findAll = () => {
    return db.schools.findAll();
  };
  
  const findOneById = (id) => {
    return db.schools.findByPk(id);
  };

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
    create,
    updateById,
  };
}

module.exports = SchoolRepository;