const rolesNameConstant = require("../constants/rolesName.constant");
const treatmentPlanService = require("../services/treatmentPlans.services");
const clientService = require("../services/clients.services");

const create = async (req, res) => {
  try {
    const {
      clientId,
      psychologistId,
      presentProblem,
      consultDate,
      parentPlan,
      programs,
      targets,
    } = req.body;

    const bodyData = {
      clientId,
      psychologistId,
      presentProblem,
      consultDate,
      parentPlan,
      programs,
      targets,
    };

    const createdPlan = await treatmentPlanService.createPlan(bodyData);

    res.jsonSuccess(
      201,
      "Successfully created new treatment plan",
      createdPlan
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getAll = async (req, res) => {
  try {
    const { clientId, status, page, limit } = req.query;
    let plans = [];
    // if (!clientId) {
    //   plans = await treatmentPlanService.getAllPlans();
    // } else {
    //   plans = await treatmentPlanService.getAllPlansByClientId(clientId);
    // }
    if (
      req.user.role === rolesNameConstant.SUPER_ADMIN ||
      req.user.role === rolesNameConstant.STAFF ||
      req.user.role === rolesNameConstant.SPED_TEACHER
    ) {
      plans = await treatmentPlanService.getAllPlans();
    } else if (req.user.role === rolesNameConstant.PSYCHOLOGIST) {
      plans = await treatmentPlanService.getAllPlansByQueryParams({
        psychologistId: req.user.id,
      });
    } else if (req.user.role === rolesNameConstant.THERAPIST) {
      plans = await treatmentPlanService.getAllPlansByQueryParams({
        therapistId: req.user.id,
      });
    } else if (!user?.role) {
      const findUser = await clientService.getClientByUuid(req.user.id);
      plans = await treatmentPlanService.getAllPlansByQueryParams({
        clientId: findUser.id,
      });
    }

    res.jsonSuccess(200, "Successfully fetched treatment plans data", plans);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getById = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await treatmentPlanService.getPlanById(planId);
    res.jsonSuccess(200, "Successfully fetched treatment plan data", plan);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getByClientId = async (req, res) => {
  try {
    const { clientId } = req.query;
    const plan = await treatmentPlanService.getAllPlansByClientId(clientId);

    res.jsonSuccess(200, "Successfully fetched client treatment plan", plan);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const { planId } = req.params;
    const {
      clientId,
      psychologistId,
      presentProblem,
      consultDate,
      parentPlan,
      programs,
      targets,
    } = req.body;

    const bodyData = {
      clientId,
      psychologistId,
      presentProblem,
      consultDate,
      parentPlan,
      programs,
      targets,
    };
    const updatedPlan = await treatmentPlanService.updatePlanById(
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

const deleteByIds = async (req, res) => {
  try {
    const { planIds } = req.body;
    const deletedPlan = await treatmentPlanService.deletePlanByIds(planIds);
    res.jsonSuccess(
      200,
      "Successfully deleted treatment plan data",
      deletedPlan
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getByClientId,
  updateById,
  deleteByIds,
};
