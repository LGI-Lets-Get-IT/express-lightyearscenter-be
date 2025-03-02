function MasterTreatmentRepository(db) {
  const findAll = () => {
    return db.masterTreatments.findAll();
  };

  const findOneById = (id) => {
    return db.masterTreatments.findByPk(id)
  }

  const create = (name, description, transaction) => {
    return db.masterTreatments.create({
      name,
      description,
    }, { transaction })
  }

  const updateById = (id, bodyData, transaction) => {
    return db.masterTreatments.update(bodyData, {
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

module.exports = MasterTreatmentRepository;