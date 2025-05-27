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

    if (!result) {
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
    const result = await treatmentRepository.updateById(typeId, bodyData, tr)

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

const deleteTreatmentByIds = async (treatmentIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedTreatments = await treatmentRepository.deleteByIds(treatmentIds, tr);
    if(!deletedTreatments) {
      customError.statusCode = 500;
      customError.message = "Failed to delete treatment type data";
      throw customError
    }

    await tr.commit()
    return deletedTreatments
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

module.exports = {
  createTreatment,
  getAllTreatments,
  getTreatmentById,
  updateTreatmentById,
  deleteTreatmentByIds,
};
