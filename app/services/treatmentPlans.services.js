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

const getAllPlansByQueryParams = async (queryParams) => {
  const result = await treatmentPlanRepository.findAll(queryParams);

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
    client: planData.client,
    // clientId: planData.clientId,
    // clientName: planData.client.fullName,
    // clientProblem: planData.client.problem,
    // guardianName: planData.client.guardianName,
    // guardianPhone: planData.client.guardianPhone,
    presentProblem: planData.presentProblem,
    consultDate: format(planData.consultDate, "dd MMM yyyy"),
    parentPlan: planData.parentPlan,
    psychologist: planData.psychologist,
    // psychologistId: planData.psychologistId,
    // psychologistName: planData.psychologist.fullName,
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
        targetBehavior: target.targetBehavior,
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
      {
        clientId: bodyData.clientId,
        psychologistId: bodyData.psychologistId,
        presentProblem: bodyData.presentProblem,
        consultDate: bodyData.consultDate,
        parentPlan: bodyData.parentPlan,
      },
      tr
    );

    if (!result[0]) {
      customError.statusCode = 500;
      customError.message = "Failed to update treatment plan";
      throw customError;
    }

    const existingPrograms =
      await treatmentProgramRepository.findAllByCondition({
        treatmentPlanId: planId,
      });
    const incomingPrograms = bodyData.programs || [];

    const programsToUpdate = incomingPrograms.filter((p) => p.id);
    const programsToCreate = incomingPrograms.filter((p) => !p.id);
    const incomingProgramIds = programsToUpdate.map((p) => p.id);
    const programsToDelete = existingPrograms.filter(
      (p) => !incomingProgramIds.includes(p.id)
    );

    // a. Delete removed programs
    if (programsToDelete.length > 0) {
      await treatmentProgramRepository.deleteById(
        programsToDelete.map((p) => p.id),
        tr
      );
    }

    // b. Update existing programs
    for (const program of programsToUpdate) {
      await treatmentProgramRepository.updateById(
        program.id,
        {
          therapistId: program.therapistId,
          treatmentTypeId: program.treatmentId,
          aimOfTreatment: program.aimOfTreatment,
          sessionFrequency: program.sessionFrequency,
          sessionDuration: program.sessionDuration,
        },
        tr
      );
    }

    // c. Create new programs
    const newPrograms = programsToCreate.map((p) => ({
      treatmentPlanId: planId,
      therapistId: p.therapistId,
      treatmentTypeId: p.treatmentId,
      aimOfTreatment: p.aimOfTreatment,
      sessionFrequency: p.sessionFrequency,
      sessionDuration: p.sessionDuration,
    }));
    if (newPrograms.length > 0) {
      await treatmentProgramRepository.bulkCreate(newPrograms, tr);
    }

    // 3. Sync Targets (same as previous explanation)
    const existingTargets = await targetedBehaviorRepository.findAllByCondition(
      {
        treatmentPlanId: planId,
      }
    );

    console.log("existingTargets", existingTargets);

    const incomingTargets = bodyData.targets || [];

    const targetsToUpdate = incomingTargets.filter((t) => t.id);
    const targetsToCreate = incomingTargets.filter((t) => !t.id);
    const incomingTargetIds = targetsToUpdate.map((t) => t.id);
    console.log("incomingTargets", incomingTargets);
    const targetsToDelete = existingTargets.filter(
      (t) => !incomingTargetIds.includes(t.id)
    );

    // a. Delete removed targets
    if (targetsToDelete.length > 0) {
      await targetedBehaviorRepository.deleteById(
        targetsToDelete.map((t) => t.id),
        tr
      );
    }

    // b. Update existing targets
    for (const target of targetsToUpdate) {
      await targetedBehaviorRepository.updateById(
        target.id,
        {
          targetBehavior: target.targetBehavior,
          shortTermTarget: target.shortTermTarget,
          currentAbility: target.currentAbility,
          mediaTools: target.mediaTools,
        },
        tr
      );
    }

    // c. Create new targets
    const newTargets = targetsToCreate.map((t) => ({
      treatmentPlanId: planId,
      targetBehavior: t.targetBehavior,
      shortTermTarget: t.shortTermTarget,
      currentAbility: t.currentAbility,
      mediaTools: t.mediaTools,
    }));
    if (newTargets.length > 0) {
      await targetedBehaviorRepository.bulkCreate(newTargets, tr);
    }

    await tr.commit();

    return result;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const deletePlanByIds = async (planIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const result = await treatmentPlanRepository.deleteByIds(planIds);
    if(!result) {
      customError.statusCode = 500;
      customError.message = "Failed to delete treatment plan data";
      throw customError;
    }

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
  getAllPlansByQueryParams,
  getPlanById,
  getAllPlansByClientId,
  updatePlanById,
  deletePlanByIds,
};
