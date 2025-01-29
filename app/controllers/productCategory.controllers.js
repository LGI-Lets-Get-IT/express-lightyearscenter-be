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
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id

    const productCategory = await productCategoryService.fetchCategoryById(categoryId)
    
    console.log('productCategory', productCategory)
    res.jsonSuccess(200, {
      indonesian: "Kategori produk berhasil diambil",
      english: "Product category fetched successfully"
    }, productCategory)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message)
  }
} 

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
  
    const createdCategory = await productCategoryService.create(name, description)

    res.jsonSuccess(200, {
      indonesian: "Kategori produk berhasil ditambah",
      english: "Product category created successfully"
    }, createdCategory)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
}

const updateCategory = async () => {
  try {
    const categoryId = req.params.id
    const updatedCategory = await productCategoryService.updateById(categoryId, req.body)

    res.jsonSuccess(200, {
      indonesian: "Kategori produk berhasil diubah",
      english: "Product category edited successfully"
    }, updatedCategory)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
};
