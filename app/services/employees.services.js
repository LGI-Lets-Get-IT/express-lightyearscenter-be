const db = require("../models");
const employeeRepository = require("../repositories/employees.repositories")(db);
const customError = new Error();

const findOneEmployeeByEmail = async (email) => {
  const employee = await employeeRepository.findOneByEmail(email);

  if (!employee) {
    customError.statusCode = 404;
    customError.message = "Employee data not found";

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
  findOneEmployeeByEmail,
  updateEmployeeToken,
};
 