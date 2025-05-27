function MasterTreatmentRepository(db) {
  const findAll = () => {
    return db.treatmentTypes.findAll({
      order: [['name', 'ASC']]
    });
  };

  const findOneById = (id) => {
    return db.treatmentTypes.findByPk(id)
  }

  const create = (bodyData, transaction) => {
    return db.treatmentTypes.create(bodyData, { transaction })
  }

  const updateById = (id, bodyData, transaction) => {
    return db.treatmentTypes.update(bodyData, {
      where: {
        id
      }
    }, { transaction })
  }
  const deleteByIds = (ids, transaction) => {
    return db.treatmentTypes.destroy({
      where: {
        id: ids
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

module.exports = MasterTreatmentRepository;