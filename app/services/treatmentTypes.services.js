const db = require("../models");
const treatmentRepository = require("../repositories/masterTreatments.repositories")(db);
const customError = new Error()

const getAllTreatments = async () => {
  const result = await treatmentRepository.findAll();

  return result;
};

const getTreatmentById = async (treatmentId) => {
  const result = await treatmentRepository.findOneById(treatmentId)

  return result;
}

const createTreatment = async (bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await treatmentRepository.create(bodyData, tr)

    if(!result) {
      customError.statusCode = 500
      customError.message = "Failed to create therapy type data"
      throw customError
    }

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
};

const updateTreatmentById = async (typeId, bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await treatmentRepository.updateById(typeId, bodyData, transaction)

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
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
