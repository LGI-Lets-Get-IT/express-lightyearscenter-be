const treatmentPlanService = require('../services/treatmentPlans.services')

const create = async (req, res) => {
    try {
        const { clientId, planId, problem, consultDate, parentPlan, programs, behaviorTargets  } = req.body;

        const bodyData = {
            clientId,
            planId,
            presentProblem: problem,
            consultDate,
            parentPlan,
            programs,
            behaviorTargets,
        }

        const createdPlan = await treatmentPlanService.createPlan(bodyData);

        res.jsonSuccess(201, "Successfully created new treatment plan", createdPlan)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

const getAll = async (req, res) => {
    try {
        const { clientId, status, page, limit } = req.query
        console.log('clientId', clientId)
        let plans = null;
        if (!clientId) {
            plans = await treatmentPlanService.getAllPlans();
        } else {
            plans = await treatmentPlanService.getAllPlansByClientId(clientId)
        }

        res.jsonSuccess(200, "Successfully fetched treatment plans data", plans)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

const getById = async (req, res) => {
    try {
        const { planId } = req.params;

        const plan = await treatmentPlanService.getPlanById(planId)
        res.jsonSuccess(200, "Successfully fetched treatment plan data", plan)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

const getByClientId = async (req, res) => {
    try {
        const { clientId } = req.query;
        const plan = await treatmentPlanService.getAllPlansByClientId(clientId);

        res.jsonSuccess(200, "Successfully fetched client treatment plan", plan)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error);
    }
}

const updateById = async (req, res) => {
    try {
        const { planId } = req.params
        const { clientId, problem, consultDate, parentPlan } = req.body;

        const bodyData = {
            clientId,
            presentProblem: problem,
            consultDate,
            parentPlan
        }
        const updatedPlan = await treatmentPlanService.updatePlanById(planId, bodyData);
        res.jsonSuccess(200, "Successfully updated treatment plan data", updatedPlan)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

const deleteById = async (req, res) => {
    try {
        const { planId } = req.body;
        const deletedPlan = await treatmentPlanService.deletePlanById(planId)
        res.jsonSuccess(200, "Successfully deleted treatment plan data", deletedPlan)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

module.exports = {
    create,
    getAll,
    getById,
    getByClientId,
    updateById,
    deleteById,
}