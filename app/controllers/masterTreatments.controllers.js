const treatmentService = require('../services/masterTreatments.services')

const getAll = async (req, res) => {
  try {
    console.log('ERORR')
    const treatments = await treatmentService.getAllTreatments()

    res.jsonSuccess(200, "Successfully get all treatments data", treatments)
  } catch (error) {
    console.log('ERROR', error)
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
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

const create = async (req, res) => {
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

const updateById = async () => {
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

const deleteIds = async (req, res) => {
  try {
    
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
}

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteIds,
};
