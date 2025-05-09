const db = require("../models");
const treatmentSessionRepository = require("../repositories/treatmentSessions.repositories")(db);
const customError = new Error()

const getAllSessions = async () => {
  const result = await treatmentSessionRepository.findAll();

  return result;
};

const createSession = async (bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    console.log('bodyyy', bodyData)
    const body = {
      ...bodyData,
      activities: bodyData.sessions.map(item => item.activity),
      progress: bodyData.sessions.map(item => item.progress),
      shortTermGoals: bodyData.sessions.map(item => item.shortTermGoals),
    }
    const result = await treatmentSessionRepository.create(body, tr)
    console.log('RESULT',)

    if(!result) {
      customError.statusCode = 500;
      customError.message = "Failed to create treatment progress";
      throw customError
    }

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
};

const updateSessionById = async (planId, bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await treatmentSessionRepository.updateById(planId, bodyData, tr)

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

const deleteSessionById = async (planId) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await treatmentSessionRepository.deleteById(planId);
    await tr.commit();

    return result;
    return true;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

module.exports = {
  createSession,
  getAllSessions,
  updateSessionById,
  deleteSessionById,
};
