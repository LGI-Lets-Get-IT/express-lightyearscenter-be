function MasterTestRepository(db) {
  const findAll = () => {
    return db.masterTests.findAll({
      raw: true,
      nest: true,
      
    });
  };


  const findOneById = (id) => {
    return db.masterTests.findByPk(id)
  }

  const create = (name, product_category, description, price, ingredients, transaction) => {
    return db.masterTests.create({
      name,
      description,
      ingredients,
      product_category_id: product_category,
      price,
    }, { transaction })
  }

  const deleteById = (id, transaction) => {
    return db.masterTests.destroy({
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

module.exports = MasterTestRepository;