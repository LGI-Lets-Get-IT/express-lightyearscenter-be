function TreatmentSessionRepository(db) {
    const findAll = () => {
      return db.treatmentSessions.findAll();
    };
  
    const findOneById = (id) => {
      return db.treatmentSessions.findOne({
        where: {
            id
        }
      })
    }

    const findAllByPlanId = (planId) => {
      return db.treatmentSessions.findAll({
        where: {
          treatmentPlanId: planId,
        },
        include: [
            {
              model: db.appointments,
              as: "appointment",
              attributes: ["id", "title", "appointmentType"],
            },
            {
              model: db.treatmentPrograms,
              as: "program",
              // attributes: [
              //   [db.sequelize.col(`treatmentType.name`), "treatmentName"],
              //   [db.sequelize.col(`therapist.full_name`), "therapistName"],
              // ],
              include: [
                {
                  model: db.treatmentTypes,
                  as: "treatmentType",
                  attributes: ["name"],
                },
                {
                  model: db.employees,
                  as: "therapist",
                  attributes: ["fullName", "phoneNumber", "email"],
                },
              ],
            },
          ],
      })
    }
  
    const create = (bodyData, transaction) => {
      return db.treatmentSessions.create(bodyData, { transaction })
    }
  
    const bulkCreate = (bodyData, transaction) => {
      return db.treatmentSessions.bulkCreate(bodyData, { transaction })
    }
  
    const updateById = (id, bodyData, transaction) => {
      return db.treatmentSessions.update(bodyData, {
        where: {
          id,
        },
      }, { transaction })
    }
  
    const deleteByIds = (id, transaction) => {
      return db.treatmentSessions.destroy({
        where: {
          id
        }
      }, { transaction })
    }
  
    return {
      findAll,
      findOneById,
      findAllByPlanId,
      create,
      bulkCreate,
      updateById,
      deleteByIds,
    };
  }
  
  module.exports = TreatmentSessionRepository;