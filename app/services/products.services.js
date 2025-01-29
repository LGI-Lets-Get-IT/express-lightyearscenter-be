const db = require("../models");
const productRepository = require("../repositories/masterproducts.repositories")(db);
const ingredientService = require('./ingredients.services')
const customError = new Error()

const fetchAllProducts = async () => {
  const products = await productRepository.findAllWithCategory();
  const mappedProducts = await ingredientService.getIngredientStock(products)

  return mappedProducts
};

const fetchProductById = async (productId) => {
  const product = await productRepository.findOneById(productId)

  return product;
}

const create = async (name, product_category, description, price, ingredients) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await productRepository.create(name, product_category, description, price, ingredients, tr)

    if(!result) {
      customError.statusCode = 500
      customError.message = {
        indonesian: "Produk gagal dibuat",
        english: "Failed to create product data"
      }
      throw customError
    }

    console.log('AFKFJFAJ')
    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    console.log('ERROR', error)
    throw error;
  }
};

module.exports = {
  fetchAllProducts,
  fetchProductById,
  create,
};
