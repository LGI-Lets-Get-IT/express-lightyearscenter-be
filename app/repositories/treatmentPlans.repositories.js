function TreatmentPlanRepository(db) {
  const findAll = () => {
    return db.treatmentPlans.findAll({
      attributes: [
        'id',
        [db.sequelize.col('client.full_name'), 'clientName']
      ],
      include: [
        {
          model: db.clients,
          as: 'client',
        },
        {
          model: db.employees,
          as: 'therapist',
        },
      ]
    });
  };

  const findOneById = (id) => {
    return db.treatmentPlans.findByPk(id)
  }

  const findAllByClientId = (clientId) => {
    return db.treatmentPlans.findAll({
      where: {
        clientId: clientId,
      },
    })
  }

  const create = (bodyData, transaction) => {
    console.log('body treatment plan', bodyData)
    return db.treatmentPlans.create(bodyData, { transaction })
  }

  const updateById = (id, bodyData, transaction) => {
    return db.treatmentPlans.update(bodyData, {
      where: {
        id,
      },
    }, { transaction })
  }

  const deleteById = (id, transaction) => {
    return db.treatmentPlans.destroy({
      where: {
        id
      }
    }, { transaction })
  }

  return {
    findAll,
    findOneById,
    findAllByClientId,
    create,
    updateById,
    deleteById,
  };
}

module.exports = TreatmentPlanRepository;