const db = require("../models");
const employeeRepository = require("../repositories/employees.repositories")(db);
const customError = new Error();

const getAllEmployees = async () => {
  const employees = await employeeRepository.findAll();

  return employees
}

const getEmployeeByEmail = async (email) => {
  const employee = await employeeRepository.findOneByEmail(email);

  return employee;
}

const getEmployeeById = async (employeeId) => {
  const employee = await employeeRepository.findOneById(employeeId);

  if (!employee) {
    customError.statusCode = 404;
    customError.message = "Employee data not found";

    throw customError;
  }

  return employee;
}

const createEmployee = async (bodyData) => {
  const employee = await employeeRepository.create(bodyData);

  if (!employee) {
    customError.statusCode = 400;
    customError.message = "Failed to create employee data";

    throw customError;
  }

  return employee;
}

const updateEmployeeToken = async (employeeId, token) => {
  return await employeeRepository.updateById(employeeId, {
    refreshToken: token,
  })
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  createEmployee,
  updateEmployeeToken,
};
 