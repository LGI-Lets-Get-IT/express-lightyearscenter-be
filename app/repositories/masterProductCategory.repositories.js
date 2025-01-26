function MasterProductCategoryRepository(db) {
  const findAll = () => {
    return db.productCategories.findAll();
  };

  const create = (name, description, transaction) => {
    return db.productCategories.create({
      name,
      description,
    }, { transaction })
  }

  return {
    findAll,
    create,
  };
}

module.exports = MasterProductCategoryRepository;