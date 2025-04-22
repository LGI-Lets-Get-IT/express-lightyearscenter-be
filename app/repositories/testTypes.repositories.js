function TestTypeRepository(db) {
  const findAll = () => {
    return db.testTypes.findAll();
  };

  const findOneById = (id) => {
    return db.testTypes.findByPk(id)
  }

  const create = (bodyData, transaction) => {
    return db.testTypes.create(bodyData, { transaction })
  }

  const updateById = (id, bodyData, transaction) => {
    return db.testTypes.update(bodyData, {
      where: {
        id
      }
    }, { transaction })
  }

  return {
    create,
    findAll,
    findOneById,
    updateById,
  };
}

module.exports = TestTypeRepository;