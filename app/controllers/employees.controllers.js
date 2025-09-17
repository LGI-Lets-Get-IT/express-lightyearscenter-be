const { format } = require("date-fns");
const employeeService = require("../services/employees.services");
const generateRandomPassword = require("../utils/generatePassword.utils");
const customError = new Error();
const RoleConstant = require("../constants/roles.constant");

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
    const psychologists = await employeeService.getAllPsychologists();
    res.jsonSuccess(
      200,
      "Successfully fetched all psychologists data",
      psychologists
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const getAllByRolePsychologistWithAvailability = async (req, res) => {
  try {
    let psychologists = [];
    console.log("FASJFSAJFASJ");
    const { appointmentDate, timeStart, timeEnd } = req.query;
    console.log("ABC");
    // Handle both single date and array of dates
    const dates = Array.isArray(appointmentDate)
      ? appointmentDate
      : [appointmentDate];

    // Fix timezone issue: Parse date without UTC conversion
    const dateStr = dates[0];
    const dateParts = dateStr.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[2]);
    const dateObj = new Date(year, month, day);

    // Get day name using JavaScript's built-in method to avoid UTC conversion
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dateToDay = dayNames[dateObj.getDay()];

    psychologists =
      await employeeService.getAllEmployeesByScheduleWithAvailability(
        RoleConstant.PSYCHOLOGIST,
        dateToDay,
        timeStart,
        timeEnd,
        dates // Pass all dates to service
      );
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

const getAllByRoleTherapistWithAvailability = async (req, res) => {
  try {
    let therapists = [];
    const { appointmentDate, timeStart, timeEnd } = req.query;

    console.log("=== CONTROLLER DEBUG ===");
    console.log("Raw query params:", req.query);
    console.log("Parsed params:", { appointmentDate, timeStart, timeEnd });

    // Handle both single date and array of dates
    const dates = Array.isArray(appointmentDate)
      ? appointmentDate
      : [appointmentDate];

    // Fix timezone issue: Parse date without UTC conversion
    const dateStr = dates[0];
    const dateParts = dateStr.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[2]);
    const dateObj = new Date(year, month, day);

    // Get day name using JavaScript's built-in method to avoid UTC conversion
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dateToDay = dayNames[dateObj.getDay()];

    console.log("Processed dates:", dates);
    console.log("Date to day:", dateToDay);

    therapists =
      await employeeService.getAllEmployeesByScheduleWithAvailability(
        RoleConstant.THERAPIST,
        dateToDay,
        timeStart,
        timeEnd,
        dates // Pass all dates to service
      );
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
    const { fullName, email, phoneNumber, roleId, schoolId, isActive } =
      req.body;

    const generatedPassword = await generateRandomPassword();
    const bodyData = {
      fullName,
      email,
      phoneNumber,
      roleId,
      schoolId,
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
  getAllByRolePsychologistWithAvailability,
  getAllByRoleTherapistWithAvailability,
  getById,
  updateById,
  updatePasswordById,
  deleteIds,
};
