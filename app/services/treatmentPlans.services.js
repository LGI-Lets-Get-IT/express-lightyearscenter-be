const db = require("../models");
const treatmentPlanRepository = require("../repositories/treatmentPlans.repositories")(db);
const treatmentPlanTreatmentService = require('../services/treatmentPlanTreatments.services');
const clientService = require('../services/clients.services');
const treatmentPlanTreatmentRepository = require("../repositories/treatmentPlanTreatments.repositories")(db);
const targetedBehaviorRepository = require("../repositories/targetedBehaviors.repositories")(db);
const customError = new Error()

const getAllPlans = async () => {
  const result = await treatmentPlanRepository.findAll();

  return result;
};

const getPlanById = async (planId) => {
  const result = await treatmentPlanRepository.findOneById(planId)

  return result;
}

const getAllPlansByClientId = async (clientUuid) => {
  const user = await clientService.getClientByUuid(clientUuid);
  const result = await treatmentPlanRepository.findAllByClientId(user.id);

  return result;
}

const createPlan = async (bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const user = await clientService.getClientByUuid(bodyData.clientId)
    const createdPlan = await treatmentPlanRepository.create({
      clientId: user.id,
      presentProblem: bodyData.presentProblem,
      consultDate: bodyData.consultDate,
      parentPlan: bodyData.parentPlan
    }, tr);
    if(!createdPlan) {
      customError.statusCode = 500;
      customError.message = "Failed to create treatment plan";
      throw customError
    }

    const mappedPrograms = bodyData.programs.map((program) => {
      return {
        ...program,
        treatmentPlanId: createdPlan.id,
      }
    });
    const createdPrograms = await treatmentPlanTreatmentRepository.bulkCreate(mappedPrograms, tr);
  
    const mappedTargets = bodyData.behaviorTargets.map((target) => {
      return {
        ...target,
        treatmentPlanId: createdPlan.id,
      }
    });
    const createdTargets = await targetedBehaviorRepository.bulkCreate(mappedTargets, tr);

    await tr.commit()

    return createdPlan;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
};

const updatePlanById = async (planId, bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await treatmentPlanRepository.updateById(planId, bodyData, tr)

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

const deletePlanById = async (planId) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await treatmentPlanRepository.deleteById(planId);
    await tr.commit();

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  getAllPlansByClientId,
  updatePlanById,
  deletePlanById,
};
