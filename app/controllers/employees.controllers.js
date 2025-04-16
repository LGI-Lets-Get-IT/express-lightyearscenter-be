const employeeService = require("../services/employees.services");
const customError = new Error();

const getAll = async (req, res) => {
  try {
    const employees = await employeeService. getAllEmployees();

    res.jsonSuccess(200, "Successfully fetched all employees data", employees);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await employeeService.getSchoolByIdWithClients(employeeId);

    res.jsonSuccess(200, "Successfully fetched employee data", employee);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

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
    const createdEmployee = await employeeService.createEmployee(bodyData);

    res.jsonSuccess(201, "Successfully created school data", createdEmployee);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const { id: schoolId } = req.params;

    const updatedSchool = await employeeService.updateSchoolById(
      schoolId,
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
  updateById,
  deleteIds,
};
