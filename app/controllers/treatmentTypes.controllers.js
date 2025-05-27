const treatmentTypeService = require('../services/treatmentTypes.services')

const getAll = async (req, res) => {
  try {
    console.log('ERORR')
    const treatments = await treatmentTypeService.getAllTreatments()

    res.jsonSuccess(200, "Successfully get all treatment types data", treatments)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { treatmentTypeId } = req.params

    const treatmentType = await treatmentTypeService.getTreatmentById(treatmentTypeId)

    res.jsonSuccess(200, "Successfully fetched treatment type", treatmentType)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message)
  }
}

const create = async (req, res) => {
  try {
    const { treatmentName, treatmentDescription } = req.body

    const bodyData = {
      name: treatmentName,
      description: treatmentDescription,
    }
    const createdRole = await treatmentTypeService.createTreatment(bodyData)

    res.jsonSuccess(201, "Successfully created new therapy type data", createdRole)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
}

const updateById = async (req, res) => {
  try {
    const { treatmentTypeId } = req.params
    const { treatmentName, treatmentDescription } = req.body;

    const bodyData = {
      name: treatmentName,
      description: treatmentDescription,
    }
    const updatedTreatment = await treatmentTypeService.updateTreatmentById(treatmentTypeId, bodyData)

    res.jsonSuccess(200, "Successfully updated treatment type", updatedTreatment)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
}

const deleteIds = async (req, res) => {
  try {
    const { treatmentIds } = req.body
    const deletedTreatments = await treatmentTypeService.deleteTreatmentByIds(treatmentIds);

    res.jsonSuccess(200, "Successfully deleted treatment type", deletedTreatments)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
}

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteIds,
};
