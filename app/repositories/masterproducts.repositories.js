function MasterProductRepository(db) {
  const findAll = () => {
    return db.products.findAll({
      raw: true,
      nest: true,
      
    });
  };

  const findAllWithCategory = () => {
    return db.products.findAll({
      raw: true,
      nest: true,
      attributes: [
        'id',
        'name',
        'description',
        'price',
        'ingredients',

      ],
      include: [
        {
          model: db.productCategories,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    })
  }

  const findOneById = (id) => {
    return db.products.findByPk(id, {
      attributes: [
        'id',
        'name',
        'description',
        'price',
        'ingredients'
      ]
    })
  }

  const create = (name, product_category, description, price, ingredients, transaction) => {
    return db.products.create({
      name,
      description,
      ingredients,
      product_category_id: product_category,
      price,
    }, { transaction })
  }

  return {
    findAll,
    findAllWithCategory,
    findOneById,
    create,
  };
}

module.exports = MasterProductRepository;