const schoolService = require("../services/schools.services");
const customError = new Error();

const getAll = async (req, res) => {
  try {
    const schools = await schoolService.getAllSchools();

    res.jsonSuccess(200, "Successfully fetched all schools data", schools);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const school = await schoolService.getSchoolByIdWithClients(schoolId);

    res.jsonSuccess(200, "Successfully fetched school data", school);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getSchoolClientsById = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const schoolClients = await schoolService.getSchoolClientsById(schoolId)

    res.jsonSuccess(200, "Successfully fetched school clients data", schoolClients);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
}

const create = async (req, res) => {
  try {
    const { schoolName, schoolAddress, schoolPhoneNumber, schoolEmail, picName, picPhoneNumber, picEmail } = req.body;

    const bodyData = {
      name: schoolName,
      address: schoolAddress,
      phoneNumber: schoolPhoneNumber,
      email: schoolEmail,
      picFullName: picName,
      picPhoneNumber: picPhoneNumber,
      picEmail: picEmail,
    };
    const createdSchool = await schoolService.createSchool(bodyData);

    res.jsonSuccess(201, "Successfully created school data", createdSchool);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSchool = await schoolService.updateSchoolById(
      id,
      req.body
    );
    res.jsonSuccess(200, "Successfully updated school data", updatedSchool);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const deleteIds = async (req, res) => {
  try {
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getSchoolClientsById,
  updateById,
  deleteIds,
};
