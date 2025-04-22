function TreatmentPlanRepository(db) {
  const findAll = () => {
    return db.treatmentPlans.findAll({
      group: ['TreatmentPlan.id', 'client.full_name', 'treatments.id', 'targetedBehaviors.id', 'psychologist.full_name'],
      attributes: [
        'id',
        [db.sequelize.col('client.full_name'), 'clientName'],
        [db.sequelize.col('psychologist.full_name'), 'plannedBy'],
        [db.sequelize.fn('COUNT', db.sequelize.col(`targetedBehaviors.id`)), 'totalTargetedBehaviors'],
        [db.sequelize.literal('CAST(COUNT(treatments.id) AS INTEGER)'), 'totalTreatments'],
        // [db.sequelize.literal('CAST(COUNT(targetedBehaviors.id) AS INTEGER)'), 'totalTargetedBehaviors'],
        'consultDate',
      ],
      include: [
        {
          model: db.clients,
          as: 'client',
          attributes: []
        },
        {
          model: db.employees,
          as: 'psychologist',
          attributes: []
        },
        {
          model: db.treatmentPlanTreatments,
          as: 'treatments',
          attributes: [],
        },
        {
          model: db.targetedBehaviors,
          as: 'targetedBehaviors',
          attributes: [],
        }
      ]
    });
  };

  const findOneById = (id) => {
    console.log('ID', id)
    return db.treatmentPlans.findOne({
      where: {
        id
      },
      include: [
        {
          model: db.treatmentSessions,
          as: 'sessions',
          separate: true,
          attributes: [
            'id',
            'title',
            'currentSession',
            'shortTermGoals',
            'activities',
            'progress',
            [db.sequelize.col(`treatmentType.name`), 'treatmentName'],
            [db.sequelize.col(`therapist.full_name`), 'therapistName'],
          ],
          include: [
            {
              model: db.appointments,
              as: 'appointment',
              attributes: [],
            },
            {
              model: db.employees,
              as: 'therapist',
              attributes: [],
            },
            {
              model: db.treatmentTypes,
              as: 'treatmentType',
              attributes: [],
            }
          ]
        }
      ]
    })
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