function MasterTreatmentRepository(db) {
  const findAll = () => {
    return db.treatmentTypes.findAll();
  };

  const findOneById = (id) => {
    return db.treatmentTypes.findByPk(id)
  }

  const create = (name, description, transaction) => {
    return db.treatmentTypes.create({
      name,
      description,
    }, { transaction })
  }

  const updateById = (id, bodyData, transaction) => {
    return db.treatmentTypes.update(bodyData, {
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