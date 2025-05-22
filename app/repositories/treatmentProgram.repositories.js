function TreatmentProgramRepository(db) {
  const findAll = () => {
    return db.treatmentPrograms.findAll();
  };

  const findAllByCondition = (whereClause) => {
    return db.treatmentPrograms.findAll({
      where: whereClause
    })
  }

  const findOneById = (id) => {
    return db.treatmentPrograms.findByPk(id)
  }

  const create = (bodyData, transaction) => {
    console.log('BODYDATA', bodyData)
    console.log('BODYDATA', bodyData)
    return db.treatmentPrograms.create(bodyData, { transaction })
  }

  const bulkCreate = (bodyData, transaction) => {
    console.log('BODYDATAAA', bodyData)
    return db.treatmentPrograms.bulkCreate(bodyData, { transaction })
  }

  const updateById = (id, bodyData, transaction) => {
    return db.treatmentPrograms.update(bodyData, {
      where: {
        id,
      },
    }, { transaction })
  }

  const updateByCondition = (whereClause, bodyData, transaction) => {
    return db.treatmentPrograms.update(bodyData, {
      where: whereClause,
    }, { transaction })
  }

  const deleteById = (id, transaction) => {
    return db.treatmentPrograms.destroy({
      where: {
        id
      }
    }, { transaction })
  }

  return {
    findAll,
    findAllByCondition,
    findOneById,
    create,
    bulkCreate,
    updateById,
    updateByCondition,
    deleteById,
  };
}

module.exports = TreatmentProgramRepository;