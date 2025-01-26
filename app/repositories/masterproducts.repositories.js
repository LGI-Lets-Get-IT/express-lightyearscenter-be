function MasterProductRepository(db) {
  const findAll = () => {
    return db.products.findAll({
      raw: true,
      nest: true
    });
  };

  const create = (name, product_category, description, price, ingredients, transaction) => {
    return db.products.create({
      name,
      description,
      ingredients,
      product_category_id: product_category,
      base_price: price,
    }, { transaction })
  }

  return {
    findAll,
    create,
  };
}

module.exports = MasterProductRepository;