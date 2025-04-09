function TreatmentPlanTreatmentRepository(db) {
  const findAll = () => {
    return db.treatmentPlanTreatments.findAll();
  };

  const findOneById = (id) => {
    return db.treatmentPlanTreatments.findByPk(id)
  }

  const create = (bodyData, transaction) => {
    console.log('BODYDATA', bodyData)
    console.log('BODYDATA', bodyData)
    return db.treatmentPlanTreatments.create(bodyData, { transaction })
  }

  const bulkCreate = (bodyData, transaction) => {
    console.log('BODYDATAAA', bodyData)
    return db.treatmentPlanTreatments.bulkCreate(bodyData, { transaction })
  }

  const updateById = (id, bodyData, transaction) => {
    return db.treatmentPlanTreatments.update(bodyData, {
      where: {
        id,
      },
    }, { transaction })
  }

  const deleteById = (id, transaction) => {
    return db.treatmentPlanTreatments.destroy({
      where: {
        id
      }
    }, { transaction })
  }

  return {
    findAll,
    findOneById,
    create,
    bulkCreate,
    updateById,
    deleteById,
  };
}

module.exports = TreatmentPlanTreatmentRepository;