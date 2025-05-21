function TargetedBehaviorRepository(db) {
  const findAll = () => {
    return db.targetedBehaviors.findAll();
  };

  const findAllByCondition = (whereClause) => {
    return db.targetedBehaviors.findAll({
      where: whereClause,
    });
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

  const updateById = (id, bodyData, transaction) => {
    return db.targetedBehaviors.update(bodyData, {
      where: {
        id,
      },
    }, transaction)
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
    findAllByCondition,
    findOneById,
    create,
    bulkCreate,
    updateById,
    deleteById,
  };
}

module.exports = TargetedBehaviorRepository;