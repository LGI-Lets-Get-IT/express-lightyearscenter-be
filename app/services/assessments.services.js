const db = require("../models");
const clientService = require('../services/clients.services')
const assessmentRepository = require("../repositories/assessments.repositories")(db);
const customError = new Error();

const getAllAssessments = async () => {
  const assessments = await assessmentRepository.findAll();

  return assessments;
};

const getAssessmentById = async (assessmentId) => {
  const assessment = await assessmentRepository.findOneById(assessmentId);

  if (!assessment) {
    customError.statusCode = 404;
    customError.message = "Assessment data not found";

    throw customError;
  }

  return assessment;
};

const createAssessment = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const clientData = await clientService.getClientByUuid(bodyData.client)
    const createdAssessment = await assessmentRepository.create({
      ...bodyData,
      client: clientData.id
    }, tr);

    if (!createdAssessment) {
      customError.statusCode = 500;
      customError.message = "Failed to create client assessment data";
      throw customError;
    }

    await tr.commit();

    return createdClient;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateAssessmentById = async (id, bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const updatedAssessment = await assessmentRepository.updateById(
      id,
      bodyData,
      tr
    );

    if (!updatedAssessment[0]) {
      customError.statusCode = 500
      customError.message = "Failed to update assessment data";
      throw customError;
    }

    await tr.commit();

    return { ...updatedAssessment[1][0] };
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const deleteAssessmentById = async (assessmentIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedAssessment = await clientRepository.deleteByIds(assessmentIds, tr);
    if (!deletedAssessment) {
      customError.statusCode = 500;
      customError.message = "Failed to delete assessments data";

      throw customError;
    }

    await tr.commit();

    return deletedAssessment;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

module.exports = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessmentById,
  deleteAssessmentById,
};
 