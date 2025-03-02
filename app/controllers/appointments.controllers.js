const appointmentService = require('../services/appointments.services')
const customError = new Error()

const getAll = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments()

    res.jsonSuccess(200, "Successfully fetched all appointments data", appointments);
  } catch (error) {
    console.log('ERROR', error)
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    
    res.jsonSuccess(200, {
      indonesian: "Bahan produk berhasil ditambah",
      english: "Product ingredientts fetched successfully",
    })
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message)
  }
}

const create =  async (req, res) => {
  try {
    const { name, unit_type, available_quantity, supplier_id } = req.body

    const createdProduct = await appointmentService.create(name, unit_type, available_quantity, supplier_id)

    res.jsonSuccess(200, {
      indonesian: "Bahan produk berhasil ditambahkan",
      english: "Product ingredient created successfully"
    }, createdProduct)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
}

const updateById = async (req, res) => {
  try {
    const ingredientId = req.params.id
    const { available_quantity } = req.body
    const updatedIngredient = await appointmentService.updateById(ingredientId, available_quantity)
    res.jsonSuccess(200, {
      indonesian: "Bahan produk berhasil diubah",
      english: "Product ingredient updated successfully"
    }, updatedIngredient)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
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
  deleteIds
};
