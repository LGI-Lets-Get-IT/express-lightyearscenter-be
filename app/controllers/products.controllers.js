const productService = require('../services/products.services')
const ingredientService = require('../services/ingredients.services')
const customError = new Error()

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await productService.fetchAllProducts()

    res.jsonSuccess(
      200,
      {
        indonesian: "Data produk berhasil diambil",
        english: "Products data fetched successfully",
      },
      allProducts
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id
    const product = await productService.fetchProductById(productId);

    res.jsonSuccess(200, {
      indonesian: "Data produk berhasil diambil",
      english: "Product data fetched successfully"
    }, product)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message)
  }
}

const createProduct =  async (req, res) => {
  try {
    const { name, product_category, description, price, ingredients } = req.body

    const createdProduct = await productService.create(name, product_category, description, price, ingredients)

    res.jsonSuccess(200, {
      indonesian: "Produk berhasil ditambahkan",
      english: "Product created successfully"
    }, createdProduct)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
}

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id
    const deletedProduct = await productService.deleteById(productId)
    
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message)
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
};
