function TestTypeRepository(db) {
  const findAll = () => {
    return db.testTypes.findAll({
      order: [['name', 'ASC']]
    });
  };

  const findOneById = (id) => {
    return db.testTypes.findOne({
      where: {
        id
      }
    })
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

  const deleteByIds = (ids, transaction) => {
    return db.testTypes.destroy({
      where: {
        id: ids,
      }
    }, { transaction })
  }

  return {
    create,
    findAll,
    findOneById,
    updateById,
    deleteByIds,
  };
}

module.exports = TestTypeRepository;