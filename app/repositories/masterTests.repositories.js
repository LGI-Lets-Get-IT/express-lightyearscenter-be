function MasterTestRepository(db) {
  const findAll = () => {
    return db.testTypes.findAll();
  };

  const findOneById = (id) => {
    return db.testTypes.findByPk(id)
  }

  const create = (bodyData, transaction) => {
    return db.testTypes.create(bodyData, { transaction })
  }

  const deleteById = (id, transaction) => {
    return db.testTypes.destroy({
      where: {
        id
      }
    }, { transaction })
  }

  return {
    findAll,
    findOneById,
    create,
    deleteById,
  };
}

module.exports = MasterTestRepository;