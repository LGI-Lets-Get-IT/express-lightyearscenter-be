const ingredientService = require('../services/ingredients.services')
const customError = new Error()

const getAllIngredients = async (req, res) => {
  try {
    const allIngredients = await ingredientService.fetchAllIngredients()

    res.jsonSuccess(200, {
        indonesian: "Bahan produk berhasil ditambah",
        english: "Product ingredientts fetched successfully",
      }, allIngredients);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const createIngredient =  async (req, res) => {
  try {
    const { name, unit_type, available_quantity, supplier_id } = req.body

    const createdProduct = await ingredientService.create(name, unit_type, available_quantity, supplier_id)

    res.jsonSuccess(200, {
      indonesian: "Bahan produk berhasil ditambahkan",
      english: "Product ingredient created successfully"
    }, createdProduct)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
}

module.exports = {
  getAllIngredients,
  createIngredient,
};
