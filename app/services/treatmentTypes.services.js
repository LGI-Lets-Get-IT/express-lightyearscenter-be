const db = require("../models");
const treatmentRepository = require("../repositories/masterTreatments.repositories")(db);
const customError = new Error()

const getAllTreatments = async () => {
  console.log('ASJDJDAADJJ')
  const result = await treatmentRepository.findAll();

  return result;
};

const getTreatmentById = async (treatmentId) => {
  const result = await treatmentRepository.findOneById(treatmentId)

  return result;
}

const createTreatment = async (name, description) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await treatmentRepository.create(name, description, tr)

    if(!result) {
      customError.statusCode = 500
      customError.message = {
        indonesian: "Kategori produk gagal dibuat",
        english: "Failed to create product category data"
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

const updateTreatmentById = async (categoryId, bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const { name, description, order } = bodyData
    const result = await treatmentRepository.update(categoryId, { name, description, order}, transaction)

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
  }
}

const deleteTreatmentById = async () => {

}

module.exports = {
  createTreatment,
  getAllTreatments,
  getTreatmentById,
  updateTreatmentById,
  deleteTreatmentById,
};
