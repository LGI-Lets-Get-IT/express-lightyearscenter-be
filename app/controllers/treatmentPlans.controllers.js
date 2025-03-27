const create = async (req, res) => {
    try {
        const createdPlan = true;

        res.jsonSuccess(201, "Successfully created new treatment plan", createdPlan)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

const getAll = async (req, res) => {
    try {
        const plans = true;
        res.jsonSuccess(200, "Successfully fetched treatment plans data", plans)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

const getById = async (req, res) => {
    try {
        const plan = true;
        res.jsonSuccess(200, "Successfully fetched treatment plan data", plan)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

const updateById = async (req, res) => {
    try {
        const updatedPlan = true;
        res.jsonSuccess(200, "Successfully updated treatment plan data", updatedPlan)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

const deleteById = async (req, res) => {
    try {
        const deletedPlan = true;
        res.jsonSuccess(200, "Successfully deleted treatment plan data", deletedPlan)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

module.exports = {
    create,
    getAll,
    getById,
    updateById,
    deleteById,
}