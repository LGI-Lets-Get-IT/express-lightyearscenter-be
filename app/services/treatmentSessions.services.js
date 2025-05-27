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
    const body = {
      ...bodyData,
      activities: bodyData.sessions.map(item => item.activity),
      progress: bodyData.sessions.map(item => item.progress),
      shortTermGoals: bodyData.sessions.map(item => item.shortTermGoals),
    }
    const result = await treatmentSessionRepository.create(body, tr)

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

const deleteSessionByIds = async (sessionIds) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await treatmentSessionRepository.deleteByIds(sessionIds, tr);
    await tr.commit();

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

const getSessionByPlanId = async (planId) => {
  try {
    const sessions = await treatmentSessionRepository.getAllByPlanId(planId);

    return sessions;
  } catch (error) {
    throw error; 
  }
} 

module.exports = {
  createSession,
  getAllSessions,
  getSessionByPlanId,
  updateSessionById,
  deleteSessionByIds,
};
