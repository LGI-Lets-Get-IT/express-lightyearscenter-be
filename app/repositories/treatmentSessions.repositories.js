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
  
    const deleteById = (id, transaction) => {
      return db.treatmentSessions.destroy({
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
  
  module.exports = TreatmentSessionRepository;