const { format } = require("date-fns");
const employeeService = require("../services/employees.services");
const generateRandomPassword = require("../utils/generatePassword.utils");
const customError = new Error();

const getAll = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();

    res.jsonSuccess(200, "Successfully fetched all employees data", employees);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getAllByRolePsychologist = async (req, res) => {
  try {
    let psychologists = [];
    const { appointmentDate, timeStart, timeEnd } = req.query;
    if (appointmentDate && timeStart && timeEnd) {
      const dateToDay = format(appointmentDate, "EEEE");
      psychologists = await employeeService.getAllEmployeesBySchedule(
        dateToDay,
        timeStart,
        timeEnd
      );
    } else {
      psychologists = await employeeService.getAllPsychologists();
    }
    res.jsonSuccess(
      200,
      "Successfully fetched all psychologists data",
      psychologists
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getAllByRoleTherapist = async (req, res) => {
  try {
    const therapists = await employeeService.getAllTherapists();
    res.jsonSuccess(
      200,
      "Successfully fetched all therapists data",
      therapists
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getById = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await employeeService.getEmployeeById(employeeId);

    res.jsonSuccess(200, "Successfully fetched employee data", employee);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const create = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, roleId, isActive } = req.body;

    const generatedPassword = await generateRandomPassword();
    const bodyData = {
      fullName,
      email,
      phoneNumber,
      roleId,
      isActive,
      password: generatedPassword,
    };
    const createdEmployee = await employeeService.createEmployee(bodyData);

    res.jsonSuccess(201, "Successfully created school data", createdEmployee);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const updateEmployee = await employeeService.updateEmployeeById(
      employeeId,
      req.body
    );
    res.jsonSuccess(200, "Successfully updated employee data", updateEmployee);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updatePasswordById = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { password } = req.body;
    const updatedEmployee = await employeeService.updateEmployeePasswordById(
      employeeId,
      password
    );
    res.jsonSuccess(
      200,
      "Successfully updated employee password",
      updatedEmployee
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const deleteIds = async (req, res) => {
  try {
    const { employeeIds } = req.body;
    const deletedEmployee = await employeeService.deleteEmployeeByIds(
      employeeIds
    );

    res.jsonSuccess(200, "Successfully deleted employee", deletedEmployee);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  create,
  getAll,
  getAllByRolePsychologist,
  getAllByRoleTherapist,
  getById,
  updateById,
  updatePasswordById,
  deleteIds,
};
