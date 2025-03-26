function TargetedBehaviorRepository(db) {
  const findAll = () => {
    return db.targetedBehaviors.findAll();
  };

  const findOneById = (id) => {
    return db.targetedBehaviors.findByPk(id)
  }

  const create = (name, product_category, description, price, ingredients, transaction) => {
    return db.targetedBehaviors.create({
      name,
      description,
      ingredients,
      product_category_id: product_category,
      price,
    }, { transaction })
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
    deleteById,
  };
}

module.exports = TargetedBehaviorRepository;