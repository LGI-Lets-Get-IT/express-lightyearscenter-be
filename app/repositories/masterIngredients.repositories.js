function MasterIngredientRepository(db) {
  const findAll = () => {
    return db.ingredients.findAll({
      raw: true,
      nest: true
    });
  };

  const create = (name, unit_type, available_quantity, supplier_id, updated_by, transaction) => {
    return db.ingredients.create({
      name,
      unit_type,
      available_quantity,
      supplier_id,
      updated_by,
    }, { transaction })
  }

  return {
    findAll,
    create,
  };
}

module.exports = MasterIngredientRepository;