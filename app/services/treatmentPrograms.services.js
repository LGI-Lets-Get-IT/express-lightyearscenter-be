const db = require("../models");
const treatmentProgramRepository = require("../repositories/treatmentProgram.repositories")(db);
const customError = new Error()

const getAllPlanTreatments = async () => {
  const result = await treatmentProgramRepository.findAll();

  return result;
};

const createPlanTreatment = async (bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await treatmentProgramRepository.bulkCreate(bodyData, tr)

    if(!result) {
      customError.statusCode = 500;
      customError.message = "Failed to create plan treatments";
      throw customError
    }

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
};

const updatePlanTreatmentById = async (planId, bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await treatmentProgramRepository.updateById(planId, bodyData, tr)

    await tr.commit()

    return true
    // return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

const deletePlanTreatmentById = async (planId) => {
  const tr = await db.sequelize.transaction()
  try {
    // const result = await treatmentPlanRepository.deleteById(planId);
    await tr.commit();

    // return result;
    return true;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

module.exports = {
  createPlanTreatment,
  getAllPlanTreatments,
  updatePlanTreatmentById,
  deletePlanTreatmentById,
};
