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

const getIngredientById = async (req, res) => {
  try {
    
    res.jsonSuccess(200, {
      indonesian: "Bahan produk berhasil ditambah",
      english: "Product ingredientts fetched successfully",
    })
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message)
  }
}

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

const updateIngredientById = async (req, res) => {
  try {
    const ingredientId = req.params.id
    const { available_quantity } = req.body
    const updatedIngredient = await ingredientService.updateById(ingredientId, available_quantity)
    res.jsonSuccess(200, {
      indonesian: "Bahan produk berhasil diubah",
      english: "Product ingredient updated successfully"
    }, updatedIngredient)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
}

module.exports = {
  getAllIngredients,
  getIngredientById,
  updateIngredientById,
  createIngredient,
};
