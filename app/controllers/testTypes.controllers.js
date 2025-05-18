const testTypeService = require('../services/testTypes.services')

const getAll = async (req, res) => {
  try {
    const tests = await testTypeService.getAllTestTypes()

    res.jsonSuccess(200, "Successfully get all test types data", tests)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { testTypeId } = req.params
    const testType = await testTypeService.getTestTypeById(testTypeId);

    res.jsonSuccess(200, "Successfully fetched test type", testType)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message)
  }
}

const create = async (req, res) => {
  try {
    const { testName, testDescription } = req.body

    const bodyData = {
      name: testName,
      description: testDescription,
    }

    const createdTest = await testTypeService.createTestType(bodyData)

    res.jsonSuccess(201, "Successfully created new test type", createdTest)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
}

const updateById = async (req, res) => {
  try {
    const { testTypeId } = req.params
    const { testName, testDescription } = req.body;

    const bodyData = {
      name: testName,
      description: testDescription
    }

    const updatedTest = await testTypeService.updateTestTypeById(testTypeId, bodyData)

    res.jsonSuccess(200, "Successfully updated test data", updatedTest)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
}

const deleteIds = async (req, res) => {
  try {

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
