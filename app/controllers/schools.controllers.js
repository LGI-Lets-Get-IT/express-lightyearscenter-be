const schoolService = require('../services/schools.services')
const customError = new Error()

const getAll = async (req, res) => {
  try {
    const schools = await schoolService.getAllSchools()

    res.jsonSuccess(200, "Successfully fetched all schools data", schools);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { id: schoolId } = req.params
    const school = await schoolService.getSchoolById(schoolId)
    
    res.jsonSuccess(200, "Successfully fetched school data", school)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
}

const create =  async (req, res) => {
  try {
    const { name, picName, address, phoneNumber, email } = req.body

    const bodyData = {
      name,
      picName,
      address,
      phoneNumber,
      email,
    }
    const createdSchool = await schoolService.createSchool(bodyData)

    res.jsonSuccess(200, "Successfully created school data", createdSchool)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
}

const updateById = async (req, res) => {
  try {
    const { id: schoolId } = req.params

    const updatedSchool = await schoolService.updateSchoolById(schoolId, req.body)
    res.jsonSuccess(200, "Successfully updated school data", updatedSchool)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
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
  deleteIds
};
