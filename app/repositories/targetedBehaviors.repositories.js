function TargetedBehaviorRepository(db) {
  const findAll = () => {
    return db.targetedBehaviors.findAll();
  };

  const findOneById = (id) => {
    return db.targetedBehaviors.findByPk(id)
  }

  const create = (bodyData, transaction) => {
    return db.targetedBehaviors.create(bodyData, { transaction })
  }

  const bulkCreate = (bodyData, transaction) => {
    return db.targetedBehaviors.bulkCreate(bodyData, { transaction })
  }

  const deleteById = (id, transaction) => {
    return db.targetedBehaviors.destroy({
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
    deleteById,
  };
}

module.exports = TargetedBehaviorRepository;