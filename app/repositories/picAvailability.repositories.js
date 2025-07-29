function picAvailabilitiesRepository(db) {
  const findAll = () => {
    return db.picAvailabilities.findAll();
  };

  const findOneById = (id) => {
    return db.picAvailabilities.findByPk(id);
  };

  const create = (bodyData, transaction) => {
    return db.picAvailabilities.create(bodyData, { transaction });
  };

  const bulkCreate = (bodyData, transaction) => {
    return db.picAvailabilities.bulkCreate(bodyData, { transaction });
  };

  const updateById = (id, bodyData, transaction) => {
    return db.picAvailabilities.update(
      bodyData,
      {
        where: {
          id,
        },
      },
      transaction
    );
  };

  const deleteById = (id, transaction) => {
    return db.picAvailabilities.destroy(
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
    bulkCreate,
    updateById,
    deleteById,
  };
}

module.exports = picAvailabilitiesRepository;
