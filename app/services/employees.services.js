const bcrypt = require("bcrypt")
const db = require("../models");
const employeeRepository = require("../repositories/employees.repositories")(
  db
);
const customError = new Error();
const RoleConstant = require("../constants/roles.constant");
const mailService = require('../services/mail.services')

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
  const tr = await db.sequelize.transaction();
  const { password, ...bodyRest } = bodyData
  const { password: generatedPassword, hashedPassword } = password
  try {
    const body = {
      ...bodyRest,
      password: hashedPassword,
    }
    const createdEmployee = await employeeRepository.create(body, tr);

    if (!createdEmployee) {
      customError.statusCode = 400;
      customError.message = "Failed to create employee data";

      throw customError;
    }

    console.log('bodyRest', bodyRest)

    await mailService.sendMail(bodyRest.email, 'Employee account created', 'ACCOUNT_CREATED', {
      fullName: bodyRest.fullName,
      email: bodyRest.email,
      password: generatedPassword,
    })

    await tr.commit();
    return createdEmployee;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateEmployeeById = async (employeeId, bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const updatedEmployee = await employeeRepository.updateById(
      employeeId,
      bodyData,
      tr,
    );

    if (!updatedEmployee) {
      customError.statusCode = 400;
      customError.message = "Failed to update employee data";

      throw customError;
    }

    await tr.commit();
    return updatedEmployee;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
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
  const tr = await db.sequelize.transaction();
  try {
    const updatedEmployee = await employeeRepository.updateById(employeeId, {
      refreshToken: token,
    });

    await tr.commit();
    return updatedEmployee;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const deleteEmployeeByIds = async (employeeIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedEmployee = await employeeRepository.deleteByIds(
      employeeIds,
      tr
    );

    await tr.commit();
    return deletedEmployee;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
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
  deleteEmployeeByIds,
};
