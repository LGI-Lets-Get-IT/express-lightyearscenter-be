const db = require("../models");
const ingredientRepository = require("../repositories/masterIngredients.repositories")(db);
const customError = new Error()

const fetchAllIngredients = async () => {
  const result = await ingredientRepository.findAll();

  return result;
};

const getIngredientStock = async (productsList) => {
  const ingredientList = await ingredientRepository.findAll()

  const ingredientStock = ingredientList.reduce((acc, ingredient) => {
    acc[ingredient['name']] = ingredient['available_quantity'];  // Assuming ingredient.name and ingredient.stock exist
    return acc;
  }, {});

  let maxProducts = Infinity
  for(let product of productsList) {
    const parsedIngredients = JSON.parse(product.ingredients)

    // stock bahan : { sugar: 20, choco_syrup: 50}. needed: { sugar: 10, choco_syrup: 5}. cuman bisa bikin 2 karena sugar sisa 20.
    Object.entries(parsedIngredients).forEach(([name, requiredQty]) => {
      const availableStock = ingredientStock[name] || 0
      const possibleProducts = Math.floor(availableStock / requiredQty)

      if(possibleProducts < maxProducts) {
        maxProducts = possibleProducts
      }
    })

    product.stock = maxProducts;

    
  }
  return productsList
}

const create = async (name, unit_type, available_quantity, supplier_id, updated_by) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await ingredientRepository.create(name, unit_type, available_quantity, supplier_id, updated_by, tr)

    if(!result) {
      customError.statusCode = 500
      customError.message = {
        indonesian: "Produk gagal dibuat",
        english: "Failed to create product data"
      }
      throw customError
    }

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
};

module.exports = {
  fetchAllIngredients,
  create,
  getIngredientStock,
};
