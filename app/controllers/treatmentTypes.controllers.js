const treatmentTypeService = require('../services/treatmentTypes.services')

const getAll = async (req, res) => {
  try {
    console.log('ERORR')
    const treatments = await treatmentTypeService.getAllTreatments()

    res.jsonSuccess(200, "Successfully get all treatment types data", treatments)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const categoryId = req.params.id

    const productCategory = await productCategoryService.fetchCategoryById(categoryId)
    
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
    const { therapyName, therapyDescription } = req.body
  
    const bodyData = {
      name: therapyName,
      description: therapyDescription,
    }
    const createdRole = await treatmentTypeService.createTreatment(bodyData)

    res.jsonSuccess(201, "Successfully created new therapy type data", createdRole)
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
