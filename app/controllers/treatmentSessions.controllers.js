const treatmentSessionService = require("../services/treatmentSessions.services");

const create = async (req, res) => {
  try {
    const { clientId, appointmentId, planId, programId, sessions } = req.body;

    const bodyData = {
      treatmentPlanId: planId,
      treatmentProgramId: programId,
      appointmentId,
      clientId,
      sessions,
    };

    const createdPlan = await treatmentSessionService.createSession(bodyData);

    res.jsonSuccess(
      201,
      "Successfully created new treatment session",
      createdPlan
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getAll = async (req, res) => {
  try {
    const { clientId } = req.query;
    let plans = null;
    if (!clientId) {
      plans = await treatmentSessionService.getAllSessions();
    } else {
      plans = await treatmentSessionService.getAllPlansByClientId(clientId);
    }

    res.jsonSuccess(200, "Successfully fetched treatment plans data", plans);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getById = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await treatmentSessionService.getPlanById(planId);
    res.jsonSuccess(200, "Successfully fetched treatment plan data", plan);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getByPlanId = async (req, res) => {
  try {
    const { planId } = req.query;
    const sessions = await treatmentSessionService.getSessionByPlanId(planId);

    return sessions;
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getByClientId = async (req, res) => {
  try {
    const { clientId } = req.query;
    const plan = await treatmentSessionService.getAllPlansByClientId(clientId);

    res.jsonSuccess(200, "Successfully fetched client treatment plan", plan);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const { planId } = req.params;
    const { clientId, problem, consultDate, parentPlan } = req.body;

    const bodyData = {
      clientId,
      presentProblem: problem,
      consultDate,
      parentPlan,
    };
    const updatedPlan = await treatmentSessionService.updatePlanById(
      planId,
      bodyData
    );
    res.jsonSuccess(
      200,
      "Successfully updated treatment plan data",
      updatedPlan
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const deleteById = async (req, res) => {
  try {
    const { sessionIds } = req.body;
    const deletedSessions = await treatmentSessionService.deleteSessionByIds(
      sessionIds
    );
    res.jsonSuccess(
      200,
      "Successfully deleted treatment session data",
      deletedSessions
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getByPlanId,
  getByClientId,
  updateById,
  deleteById,
};
