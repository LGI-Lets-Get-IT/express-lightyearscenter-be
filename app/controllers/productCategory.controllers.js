const productCategoryService = require('../services/productCategory.services')

const getAllCategories = async (req, res) => {
  try {
    const allCategories = await productCategoryService.fetchAllCategories()

    res.jsonSuccess(
      200,
      {
        indonesian: "Data kategori produk berhasil diambil",
        english: "Product categories data fetched successfully",
      },
      allCategories
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.code, error?.message);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
  
    const createdCategory = await productCategoryService.create(name, description)

    res.jsonSuccess(200, {
      indonesian: "Kategori produk berhasil ditambah",
      english: "Product category created successfully"
    }, createdCategory)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.code, error?.message);
  }
}

module.exports = {
  getAllCategories,
  createCategory,
};
