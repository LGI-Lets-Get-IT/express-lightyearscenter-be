function MasterProductCategoryRepository(db) {
  const findAll = () => {
    return db.productCategories.findAll();
  };

  const findOneById = (id) => {
    return db.productCategories.findByPk(id)
  }

  const create = (name, description, transaction) => {
    return db.productCategories.create({
      name,
      description,
    }, { transaction })
  }

  const update = (id, bodyData, transaction) => {
    return db.productCategories.update(bodyData, {
      where: {
        id
      }
    }, { transaction })
  }

  return {
    findAll,
    findOneById,
    create,
    update,
  };
}

module.exports = MasterProductCategoryRepository;