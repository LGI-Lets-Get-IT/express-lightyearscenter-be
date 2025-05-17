const db = require("../models");
const treatmentPlanRepository =
  require("../repositories/treatmentPlans.repositories")(db);
const treatmentProgramService = require("../services/treatmentPrograms.services");
const clientService = require("../services/clients.services");
const { format } = require("date-fns/format");
const treatmentProgramRepository =
  require("../repositories/treatmentProgram.repositories")(db);
const targetedBehaviorRepository =
  require("../repositories/targetedBehaviors.repositories")(db);
const customError = new Error();

const getAllPlans = async () => {
  const result = await treatmentPlanRepository.findAll();

  return result;
};

const getPlanById = async (planId) => {
  let planData = await treatmentPlanRepository.findOneById(planId);
  planData = planData.get({ plain: true });
  let programsDone = 0;
  const mappedPrograms = planData.programs.map((program) => {
    const findSession = planData.sessions.filter(
      (session) => session.treatmentProgramId === program.id
    );
    const remainingSession = findSession.length;
    const isCompleted = findSession.length > program.sessionFrequency;
    programsDone += isCompleted ? 1 : 0;
    return {
      ...program,
      isCompleted,
      remainingSession,
    };
  });
  const result = {
    id: planData.id,
    clientId: planData.clientId,
    clientName: planData.client.fullName,
    guardianName: planData.client.guardianName,
    guardianPhone: planData.client.guardianPhone,
    presentProblem: planData.presentProblem,
    consultDate: format(planData.consultDate, "dd MMM yyyy"),
    parentPlan: planData.parentPlan,
    psychologistId: planData.psychologistId,
    psychologistName: planData.psychologist.fullName,
    totalPrograms: planData.programs.length ?? 0,
    totalTargets: planData.targetedBehaviors.length ?? 0,
    programsDone,
    updatedAt: planData.updatedAt,
    programs: mappedPrograms,
    targets: planData.targetedBehaviors,
    sessions: planData.sessions,
  };

  return result;
};

const getAllPlansByClientId = async (clientUuid) => {
  const user = await clientService.getClientByUuid(clientUuid);
  const result = await treatmentPlanRepository.findAllByClientId(user.id);

  return result;
};

const createPlan = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const createdPlan = await treatmentPlanRepository.create(
      {
        clientId: bodyData.clientId,
        psychologistId: bodyData.psychologistId,
        presentProblem: bodyData.presentProblem,
        consultDate: bodyData.consultDate,
        parentPlan: bodyData.parentPlan,
      },
      tr
    );
    if (!createdPlan) {
      customError.statusCode = 500;
      customError.message = "Failed to create treatment plan";
      throw customError;
    }

    const mappedPrograms = bodyData.programs.map((program) => {
      return {
        treatmentPlanId: createdPlan.id,
        therapistId: program.therapistId,
        treatmentTypeId: program.treatmentId,
        aimOfTreatment: program.aimOfTreatment,
        sessionFrequency: program.sessionFrequency,
        sessionDuration: program.sessionDuration,
      };
    });
    const createdPrograms = await treatmentProgramRepository.bulkCreate(
      mappedPrograms,
      tr
    );

    const mappedTargets = bodyData.targets.map((target) => {
      return {
        targetBehavior: target.behavior,
        shortTermTarget: target.shortTermTarget,
        currentAbility: target.currentAbility,
        mediaTools: target.mediaTools,
        treatmentPlanId: createdPlan.id,
      };
    });
    const createdTargets = await targetedBehaviorRepository.bulkCreate(
      mappedTargets,
      tr
    );

    await tr.commit();

    return createdPlan;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updatePlanById = async (planId, bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const result = await treatmentPlanRepository.updateById(
      planId,
      bodyData,
      tr
    );

    await tr.commit();

    return result;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const deletePlanById = async (planId) => {
  const tr = await db.sequelize.transaction();
  try {
    const result = await treatmentPlanRepository.deleteById(planId);
    await tr.commit();

    return result;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  getAllPlansByClientId,
  updatePlanById,
  deletePlanById,
};
