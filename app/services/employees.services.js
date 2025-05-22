const bcrypt = require('bcrypt')
const db = require("../models");
const employeeRepository = require("../repositories/employees.repositories")(
  db
);
const customError = new Error();
const RoleConstant = require("../constants/roles.constant");

const getAllEmployees = async () => {
  const employees = await employeeRepository.findAll();

  return employees;
};

const getAllPsychologists = async () => {
  const psychologists = await employeeRepository.findAllByRoleId(
    RoleConstant.PSYCHOLOGIST
  );

  return psychologists;
};

const getAllTherapists = async () => {
  const psychologists = await employeeRepository.findAllByRoleId(
    RoleConstant.THERAPIST
  );

  return psychologists;
};

const getEmployeeByEmail = async (email) => {
  const employee = await employeeRepository.findOneByEmail(email);

  return employee;
};

const getEmployeeById = async (employeeId) => {
  const employee = await employeeRepository.findOneById(employeeId);

  if (!employee) {
    customError.statusCode = 404;
    customError.message = "Employee data not found";

    throw customError;
  }

  return employee;
};

const createEmployee = async (bodyData) => {
  const employee = await employeeRepository.create(bodyData);

  if (!employee) {
    customError.statusCode = 400;
    customError.message = "Failed to create employee data";

    throw customError;
  }

  return employee;
};

const updateEmployeeById = async (employeeId, bodyData) => {
  const employee = await employeeRepository.updateById(employeeId, bodyData);

  if (!employee) {
    customError.statusCode = 400;
    customError.message = "Failed to update employee data";

    throw customError;
  }

  return employee;
};

const updateEmployeePasswordById = async (id, password) => {
  const tr = await db.sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedEmployee = await employeeRepository.updateById(id, {
      password: hashedPassword
    }, tr)

    await tr.commit()

    return updatedEmployee
  } catch (error) {
    await tr.rollback()
    throw error
  }
}

const updateEmployeeToken = async (employeeId, token) => {
  return await employeeRepository.updateById(employeeId, {
    refreshToken: token,
  });
};

module.exports = {
  getAllEmployees,
  getAllTherapists,
  getAllPsychologists,
  getEmployeeById,
  getEmployeeByEmail,
  createEmployee,
  updateEmployeeToken,
  updateEmployeeById,
  updateEmployeePasswordById,
};
