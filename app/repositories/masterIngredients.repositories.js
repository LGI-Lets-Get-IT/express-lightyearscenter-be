function MasterIngredientRepository(db) {
  const findAll = () => {
    return db.ingredients.findAll({
      raw: true,
      nest: true
    });
  };

  const create = (name, keyName, unit_type, available_quantity, supplier_id, updated_by, transaction) => {
    return db.ingredients.create({
      name,
      key: keyName,
      unit_type,
      available_quantity,
      supplier_id,
      updated_by,
    }, { transaction })
  }

  const updateById = (id, bodyData, transaction) => {
    return db.ingredients.update(bodyData, {
      where: {
        id
      },
    }, { transaction })
  }

  return {
    findAll,
    create,
    updateById,
  };
}

module.exports = MasterIngredientRepository;